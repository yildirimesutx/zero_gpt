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
  PanResponder,
  Clipboard, ToastAndroid
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import useChatBot from '../hooks/useChatBot';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import robotAssistant from '../../assets/logo_tr_light.png';
import useChatHistoricPost from '../hooks/useChatHistoricPost';
import { StatusBar } from 'expo-status-bar';

const ChatPage = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const conversationId = route.params?.conversationId || null;
  const newConversation = route.params?.newConversation || false;

  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const { messages, sendMessage, loading, setMessages } = useChatBot();
  const { sendHistoricMail, loading: mailLoading, error: mailError } = useChatHistoricPost();

  const [inputText, setInputText] = useState('');
  const [dots, setDots] = useState('');
  const [showPrompts, setShowPrompts] = useState(true);
  const [currentConversation, setCurrentConversation] = useState({
    id: null,
    title: '',
    time: '',
    messages: [],
  });
  // E-posta gönderimi için modal ve input state'i
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  const prompts = i18n.t('prompts');

  // Header ayarlarında sağ tarafa e-posta gönderim ikonu ekliyoruz (mesaj varsa)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={24} color={theme.colors.headerText} />
        </TouchableOpacity>
      ),
      headerTitle: i18n.t('zero_gpt'),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: theme.colors.headerBg,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: theme.colors.headerText,
      headerRight: () =>
        messages && messages.length > 0 && (
          <TouchableOpacity onPress={() => setShowEmailModal(true)} style={{ marginRight: 16 }}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.headerText} />
          </TouchableOpacity>
        ),
    });
  }, [navigation, theme, messages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (conversationId) {
      loadOldConversation(conversationId);
    } else if (newConversation) {
      setMessages([]);
      createNewConversation();
    } else if (!conversationId) {
      createNewConversation();
    }
  }, [conversationId, newConversation]);

  const loadOldConversation = async (id) => {
    try {
      const stored = await AsyncStorage.getItem('conversations');
      if (stored) {
        const arr = JSON.parse(stored);
        const found = arr.find((c) => c.id === id);
        if (found) {
          setCurrentConversation(found);
          setMessages(found.messages);
        }
      }
    } catch (error) {
      console.log('loadOldConversation error:', error);
    }
  };

  const createNewConversation = () => {
    const now = new Date();
    const conv = {
      id: Date.now(),
      title: "Yeni Sohbet",
      time: now.toLocaleString(),
      messages: [],
    };
    setCurrentConversation(conv);
  };

  // Her durumda konuşma güncellensin
  useEffect(() => {
    if (currentConversation.id) {
      saveConversation({ ...currentConversation, messages });
    }
  }, [messages]);

  const saveConversation = async (conv) => {
    try {
      let data = await AsyncStorage.getItem('conversations');
      let arr = data ? JSON.parse(data) : [];
      const idx = arr.findIndex((c) => c.id === conv.id);
      if (idx >= 0) {
        arr[idx] = conv;
      } else {
        arr.push(conv);
      }
      await AsyncStorage.setItem('conversations', JSON.stringify(arr));
    } catch (err) {
      console.log('saveConversation error:', err);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, deepSearchActive);
    setInputText('');
    setShowPrompts(false);
  };

  const handlePromptPress = (promptTitle) => {
    sendMessage(promptTitle);
    setInputText('');
    setShowPrompts(false);
  };

  // Fonksiyon: Modal içindeki e-postanın gönderilmesi
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Dikey hareket 5 pikselin üzerindeyse pan responder'ı aktif et
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: () => {
      // Bu aşamada parent (FlatList) scroll davranışını devralabilir
    },
    onPanResponderTerminationRequest: () => true,
  });



  // renderMessageItem fonksiyonu:
const renderMessageItem = ({ item }) => {
  const isUser = item.sender === 'user';
  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      {!isUser && (
        <Image
          source={require('../../assets/robot.png')}
          style={styles.botIcon}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? { backgroundColor: theme.colors.userBubble } : styles.botMessage,
        ]}
        // Dokunma olaylarının alt bileşene iletilmesini sağlıyoruz:
        pointerEvents="box-none"
      >
        <View pointerEvents="auto">
        <Text
            selectable
            onLongPress={() => {
              Clipboard.setString(item.text);
              ToastAndroid.show('Metin kopyalandı!', ToastAndroid.SHORT);
            }}
            style={[
              styles.messageText,
              {
                color: isUser
                  ? (theme.colors.background === '#FFFFFF' ? '#000' : '#FFF')
                  : theme.colors.text,
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

  
  const displayedMessages = messages;

  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

 

  return (
    <>
    <StatusBar
        // Arkaplan siyahsa beyaz ikonlar ve metin görünmesi için:
        barStyle={theme.colors.statusBarStyle}
        backgroundColor={theme.colors.statusBarBackground}
      />
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
            ref={flatListRef}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            data={
              loading
                ? [...displayedMessages, { id: 'loading', text: dots, sender: 'bot' }]
                : displayedMessages
            }
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : `msg-${index}`
            }
            renderItem={({ item }) => {
              if (item.id === 'loading') {
                return (
                  <View style={styles.botContainer}>
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>{dots}</Text>
                  </View>
                );
              }
              // Ekstra onStartShouldSetResponderCapture kaldırıldı
              return renderMessageItem({ item });
            }}
            style={styles.messageList}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* Promtlar */}
          {showPrompts && inputText.trim().length === 0 && messages.length === 0 && (
              <>
                {i18n.locale && i18n.locale.toLowerCase().startsWith("tr") ? (
                  <Image 
                    source={robotAssistant} 
                    style={styles.assistantImage} 
                    pointerEvents="none" 
                  />
                ) : (
                  <Image 
                    source={require('../../assets/logo_new.png')} 
                    style={styles.assistantImage} 
                    pointerEvents="none" 
                  />
                )}
              </>
            )}


          {showPrompts && inputText.trim().length === 0 && (
            <View style={styles.promptsContainer}>
              <FlatList
                keyboardShouldPersistTaps="always"
                data={prompts}
                horizontal
                keyExtractor={(item, idx) => `${idx}`}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.promptItem, { backgroundColor: theme.colors.inputBg }]}
                    onPress={() => handlePromptPress(item.title)}
                  >
                    <Text style={[styles.promptTitle, { color: theme.colors.text }]}>{item.title}</Text>
                    <Text style={[styles.promptDescription, { color: theme.colors.text }]}>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Normal mesaj gönderme alanı */}
          <View style={styles.bottomContainer}>
            <View
              style={[
                styles.inputWrapper,
                {
                  flexDirection: 'column',
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                  borderWidth: theme.colors.inputBorder === 'transparent' ? 0 : 1,
                },
              ]}
            >
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.textInput, { color: theme.colors.text }]}
                  placeholder={i18n.t('placeholder_message')}
                  placeholderTextColor={theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'}
                  value={inputText}
                  onChangeText={(text) => {
                    setInputText(text);
                    if (text.trim().length > 0) {
                      setShowPrompts(false);
                    }
                  }}
                  multiline
                  editable={true}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  style={[styles.iconWrapper, { backgroundColor: theme.colors.primary, marginLeft: 8 }]}
                >
                  <Ionicons name="send" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.deepSearchRow}>
                <TouchableOpacity
                  onPress={() => setDeepSearchActive(!deepSearchActive)}
                  style={[
                    styles.deepSearchButton,
                    {
                      borderColor: deepSearchActive
                        ? theme.colors.primary
                        : (theme.colors.background === '#000000' ? '#FFF' : '#000'),
                    },
                  ]}
                >
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={deepSearchActive ? theme.colors.primary : theme.colors.text}
                  />
                  <Text style={{ marginLeft: 4, color: deepSearchActive ? theme.colors.primary : theme.colors.text }}>
                    {i18n.t('deep_search')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Email gönderimi için modal */}
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
                  <TouchableOpacity
                    onPress={() => {
                      setEmail('');
                      setShowEmailModal(false);
                    }}
                    style={[styles.modalButton, { backgroundColor: '#aaa' }]}
                  >
                    <Text style={styles.modalButtonText}>{i18n.t('send_history.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSendEmail}
                    style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                    disabled={mailLoading}
                  >
                    <Text style={styles.modalButtonText}>
                      {mailLoading ? i18n.t('send_history.sending') : i18n.t('send_history.send')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  botIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '90%',
  },
  botMessage: {
    backgroundColor: 'transparent',
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  messageText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  bottomContainer: {
    padding: 10,
    marginBottom: 30,
  },
  inputWrapper: {
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 60,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 20,
  },
  deepSearchRow: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  deepSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    textAlign: 'left',
  },
  promptsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  promptItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 150,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  promptDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  assistantImage: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    opacity: 0.5,
    width: 230,
    height: 170,
    resizeMode: 'contain',
    zIndex: 2,
    pointerEvents: 'none',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
