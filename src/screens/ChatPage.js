import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  Platform,
  Image,
  Alert,
  Modal,
  Clipboard,
  ToastAndroid
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import useChatBot from '../hooks/useChatBot';
import useChatHistoricPost from '../hooks/useChatHistoricPost';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const ChatPage = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const insets = useSafeAreaInsets();

  const conversationId = route.params?.conversationId || null;
  const newConversation = route.params?.newConversation || false;

  const { messages, sendMessage, loading, setMessages } = useChatBot();
  const { sendHistoricMail, loading: mailLoading, error: mailError } = useChatHistoricPost();

  const [inputText, setInputText] = useState('');
  const [dots, setDots] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);
  const [deepSearchActive, setDeepSearchActive] = useState(false);

  const [currentConversation, setCurrentConversation] = useState({ id: null, title: '', time: '', messages: [] });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  // --- Feedback state ---
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState(null);
  const [selectedFeedbackOption, setSelectedFeedbackOption] = useState('');
  const [otherFeedbackText, setOtherFeedbackText] = useState('');

  // --- Feedback options from i18n ---
  const feedbackOptions = [
    i18n.t('feedback.option.incorrect'),
    i18n.t('feedback.option.insufficient'),
    i18n.t('feedback.option.harmful'),
    i18n.t('feedback.option.other'),
  ];

  const prompts = i18n.t('prompts');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={24} color={theme.colors.headerText} />
        </TouchableOpacity>
      ),
      headerTitle: i18n.t('zero_gpt'),
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: theme.colors.headerBg, elevation: 0, shadowOpacity: 0 },
      headerTintColor: theme.colors.headerText,
      headerRight: () => (
        messages.length > 0 && (
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowEmailModal(true)}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.headerText} />
          </TouchableOpacity>
        )
      )
    });
  }, [navigation, theme, messages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  

  useEffect(() => {
    if (conversationId) {
      loadOldConversation(conversationId);
    } else {
      setMessages([]);
      createNewConversation();
    }
  }, [conversationId, newConversation]);

  const loadOldConversation = async id => {
    try {
      const stored = await AsyncStorage.getItem('conversations');
      if (stored) {
        const list = JSON.parse(stored);
        const conv = list.find(c => c.id === id);
        if (conv) {
          setCurrentConversation(conv);
          setMessages(conv.messages);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createNewConversation = () => {
    const now = new Date();
    const conv = {
      id: Date.now(),
      title: i18n.t('chat.new_title'),
      time: now.toLocaleString(),
      messages: []
    };
    setCurrentConversation(conv);
  };

  useEffect(() => {
    if (currentConversation.id !== null) {
      saveConversation({ ...currentConversation, messages });
    }
  }, [messages]);

  const saveConversation = async conv => {
    try {
      const data = await AsyncStorage.getItem('conversations');
      const list = data ? JSON.parse(data) : [];
      const idx = list.findIndex(c => c.id === conv.id);
      if (idx >= 0) list[idx] = conv;
      else list.push(conv);
      await AsyncStorage.setItem('conversations', JSON.stringify(list));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, deepSearchActive);
    setInputText('');
    setShowPrompts(false);
  };

  const handlePromptPress = title => {
    sendMessage(title);
    setInputText('');
    setShowPrompts(false);
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert(
        i18n.t('send_history.warning_title'),
        i18n.t('send_history.invalid_email')
      );
      return;
    }
    await sendHistoricMail(email, currentConversation.messages);
    if (!mailError) {
      Alert.alert(
        i18n.t('send_history.info_title'),
        i18n.t('send_history.history_sent')
      );
      setEmail('');
      setShowEmailModal(false);
    }
  };

  // --- Like feedback ---
  const handleLike = messageId => {
    Alert.alert(
      i18n.t('feedback.alert.title'),
      i18n.t('feedback.alert.thanks')
    );
    fetch('https://www.zerowastegpt.org/api/send/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: messageId.toString(), status: 'like' })
    }).catch(err => console.error('Like feedback hatası:', err));
  };

  // --- Dislike feedback modal ---
  const openFeedbackModal = id => {
    setFeedbackMessageId(id);
    setSelectedFeedbackOption('');
    setOtherFeedbackText('');
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedFeedbackOption) {
      return Alert.alert(
        i18n.t('feedback.alert.title'),
        i18n.t('feedback.alert.select_option')
      );
    }
    const status = selectedFeedbackOption === i18n.t('feedback.option.other')
      ? otherFeedbackText.trim()
      : selectedFeedbackOption;
    if (!status) {
      return Alert.alert(
        i18n.t('feedback.alert.title'),
        i18n.t('feedback.alert.enter_feedback')
      );
    }

    setShowFeedbackModal(false);
    Alert.alert(
      i18n.t('feedback.alert.title'),
      i18n.t('feedback.alert.thanks')
    );

    try {
      await fetch('https://www.zerowastegpt.org/api/send/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: feedbackMessageId.toString(), status })
      });
    } catch (err) {
      console.error('Dislike feedback hatası:', err);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.botContainer]}>
        {!isUser && (
          <Image source={require('../../assets/robot-assistant-2.png')} style={styles.botIcon} />
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? { backgroundColor: theme.colors.userBubble } : styles.botMessage
          ]}
          pointerEvents="box-none"
        >
          <Text
            selectable
            onLongPress={() => {
              Clipboard.setString(item.text);
              ToastAndroid.show(i18n.t('common.copied_to_clipboard'), ToastAndroid.SHORT);
            }}
            style={[
              styles.messageText,
              {
                color: isUser
                  ? (theme.colors.background === '#FFFFFF' ? '#000' : '#FFF')
                  : theme.colors.text
              }
            ]}
          >
            {item.text}
          </Text>
          {!isUser && (
            <View style={styles.feedbackContainer}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.feedbackIcon}>
                <Ionicons name="thumbs-up-outline" size={17} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openFeedbackModal(item.id)} style={styles.feedbackIcon}>
                <Ionicons name="thumbs-down-outline" size={17} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const flatListRef = useRef(null);
  useEffect(() => {
    if (messages.length && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <>
      <StatusBar barStyle={theme.colors.statusBarStyle} backgroundColor={theme.colors.statusBarBackground} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 50}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
            <View style={{ flex: 1 }}>
              {/* Mesaj Listesi */}
              <FlatList
                ref={flatListRef}
                keyboardShouldPersistTaps="always"
                // keyboardDismissMode="on-drag"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
                data={loading ? [...messages, { id: 'loading', text: dots, sender: 'bot' }] : messages}
                keyExtractor={(item, idx) => item.id ? item.id.toString() : `msg-${idx}`}
                renderItem={({ item }) =>
                  item.id === 'loading' ? (
                    <View style={styles.botContainer}>
                      <Text style={[styles.loadingText, { color: theme.colors.text }]}>{dots}</Text>
                    </View>
                  ) : (
                    renderMessageItem({ item })
                  )
                  
                }
                // contentContainerStyle={[styles.listContent, { paddingBottom: 8 }]}
                contentContainerStyle={[
                   styles.listContent,
                     // insets.bottom + inputWrapper yüksekliği (örn. 80)
                     { paddingBottom: insets.bottom + 80 }
                   ]}
                style={{ flex: 1 }}
                onContentSizeChange={() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }}
              />
              {/* Promptlar inputun hemen üstünde, sabit boşluklu */}
              {showPrompts && inputText.trim().length === 0 && (
                <View style={styles.promptsContainerFixed}>
                  <FlatList
                    horizontal
                    data={prompts}
                    keyExtractor={(_, i) => i.toString()}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[styles.promptItem, { backgroundColor: theme.colors.inputBg }]}
                        onPress={() => handlePromptPress(item.title)}
                      >
                        <Text style={[styles.promptTitle, { color: theme.colors.text }]}>{item.title}</Text>
                        <Text style={[styles.promptDescription, { color: theme.colors.text }]}> 
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
            {/* Mesaj Giriş & Gönder */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
              <View style={styles.bottomContainer}> 
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.inputBg,
                      borderColor: theme.colors.inputBorder,
                      borderWidth: theme.colors.inputBorder === 'transparent' ? 0 : 1
                    }
                  ]}
                  pointerEvents="box-none"
                >
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.textInput, { color: theme.colors.text }]}
                      placeholder={i18n.t('placeholder_message')}
                      placeholderTextColor={theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'}
                      value={inputText}
                      onChangeText={text => { setInputText(text); setShowPrompts(!text.trim()); }}
                      multiline
                    />
                    <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}> 
                      <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.deepSearchRow}>
                    <TouchableOpacity
                      onPress={() => setDeepSearchActive(!deepSearchActive)}
                      style={[
                        styles.deepSearchButton,
                        { borderColor: deepSearchActive ? theme.colors.primary : theme.colors.text }
                      ]}
                    >
                      <Ionicons
                        name="globe-outline"
                        size={20}
                        color={deepSearchActive ? theme.colors.primary : theme.colors.text}
                      />
                      <Text style={styles.deepSearchText}>{i18n.t('deep_search')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>

            {/* Email Modal */}
            <Modal visible={showEmailModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                    {i18n.t('send_history.email_prompt')}
                  </Text>
                  <TextInput
                    style={[styles.modalInput, { color: theme.colors.text, borderColor: theme.colors.inputBorder }]}
                    placeholder={i18n.t('send_history.email_placeholder')}
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#aaa' }]} onPress={() => setShowEmailModal(false)}>
                      <Text style={styles.modalButtonText}>{i18n.t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                      onPress={handleSendEmail}
                      disabled={mailLoading}
                    >
                      <Text style={styles.modalButtonText}>
                        {mailLoading ? i18n.t('send_history.sending') : i18n.t('common.send')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Feedback Modal */}
            <Modal visible={showFeedbackModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                    {i18n.t('feedback.modal.title')}
                  </Text>
                  {feedbackOptions.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.feedbackOption}
                      onPress={() => setSelectedFeedbackOption(opt)}
                    >
                      <Text style={[styles.feedbackText, { color: theme.colors.text }]}>
                        {selectedFeedbackOption === opt ? '● ' : '○ '} {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {selectedFeedbackOption === i18n.t('feedback.option.other') && (
                    <TextInput
                      style={[styles.modalInput, { color: theme.colors.text, borderColor: theme.colors.inputBorder }]}
                      placeholder={i18n.t('feedback.placeholder')}
                      placeholderTextColor="#999"
                      value={otherFeedbackText}
                      onChangeText={setOtherFeedbackText}
                      multiline
                    />
                  )}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: '#aaa' }]}
                      onPress={() => setShowFeedbackModal(false)}
                    >
                      <Text style={styles.modalButtonText}>{i18n.t('common.cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        {
                          backgroundColor:
                            selectedFeedbackOption === i18n.t('feedback.option.other') && otherFeedbackText.trim() === ''
                              ? '#ccc'
                              : theme.colors.primary
                        }
                      ]}
                      onPress={handleSubmitFeedback}
                      disabled={selectedFeedbackOption === i18n.t('feedback.option.other') && otherFeedbackText.trim() === ''}
                    >
                      <Text style={styles.modalButtonText}>{i18n.t('common.send')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Policy text en altta, klavye açılınca gizlenebilir */}
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 25, alignItems: 'center', zIndex: 1 }} pointerEvents="none">
              <Text style={[styles.policy_text, { color: theme.colors.text }]}>{i18n.t('policy_text')}</Text>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, position: 'relative', paddingBottom: 40 },
  headerButton: { marginHorizontal: 16 },
  listContent: { paddingBottom: 20 },
  messageContainer: { marginVertical: 5, flexDirection: 'row' },
  userContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  botContainer: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  botIcon: { width: 30, height: 30, resizeMode: 'contain', marginRight: 8 },
  messageBubble: { padding: 12, borderRadius: 18, maxWidth: '90%' },
  botMessage: { backgroundColor: 'transparent', width: '100%' },
  messageText: { fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto' },
  loadingText: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16 },
  assistantImage: { position: 'absolute', top: '15%', alignSelf: 'center', opacity: 0.5, width: 120, height: 120, resizeMode: 'contain', zIndex: 2 },
  promptsContainerFixed: { paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8 },
  promptItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, minWidth: 150 },
  promptTitle: { fontSize: 14, fontWeight: 'bold' },
  promptDescription: { fontSize: 12, marginTop: 2 },
  bottomContainer: { padding: 10 },
  inputWrapper: { borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  textInput: { flex: 1, fontSize: 16, minHeight: 40, maxHeight: 100 },
  sendButton: { padding: 10, borderRadius: 20 },
  deepSearchRow: { marginTop: 8, alignItems: 'flex-start' },
  deepSearchButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  deepSearchText: { marginLeft: 4, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginLeft: 8 },
  modalButtonText: { color: '#FFF', fontWeight: 'bold' },
  feedbackContainer: { flexDirection: 'row', marginTop: 8 },
  feedbackIcon: { marginRight: 12 },
  feedbackOption: { paddingVertical: 8 },
  feedbackText: { fontSize: 16 },
  policy_text : {fontSize: 11, textAlign: 'center' }
});
