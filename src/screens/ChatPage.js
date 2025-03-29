import React, { useEffect, useLayoutEffect, useState } from 'react';
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
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import useChatBot from '../hooks/useChatBot';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import robotAssistant from '../../assets/robot-assistant.png';
import useChatHistoricPost from '../hooks/useChatHistoricPost';

const ChatPage = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const conversationId = route.params?.conversationId || null;
  const readOnly = route.params?.readOnly || false;
  const newConversation = route.params?.newConversation || false;

  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const { messages, sendMessage, loading, setMessages } = useChatBot();
  const { sendHistoricMail, loading: mailLoading, error: mailError } = useChatHistoricPost();

  const [inputText, setInputText] = useState('');
  const [dots, setDots] = useState('');
  const [showPrompts, setShowPrompts] = useState(!readOnly);
  const [currentConversation, setCurrentConversation] = useState({
    id: null,
    title: '',
    time: '',
    messages: [],
  });
  const [email, setEmail] = useState('');

  const prompts = i18n.t('prompts');

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
    });
  }, [navigation, theme]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (readOnly && conversationId) {
      loadOldConversation(conversationId);
    } else if (newConversation) {
      setMessages([]);
      createNewConversation();
    } else if (!readOnly && !conversationId) {
      createNewConversation();
    }
  }, [conversationId, readOnly, newConversation]);

  const loadOldConversation = async (id) => {
    try {
      const stored = await AsyncStorage.getItem('conversations');
      if (stored) {
        const arr = JSON.parse(stored);
        const found = arr.find((c) => c.id === id);
        if (found) {
          setCurrentConversation(found);
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

  useEffect(() => {
    if (!readOnly && currentConversation.id) {
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

  const handleSendHistory = async () => {
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
    }
  };

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
            isUser
              ? { backgroundColor: theme.colors.userBubble }
              : styles.botMessage,
          ]}
          pointerEvents="box-none"
        >
          {/* Dokunma olaylarını engellemek için metni ek bir View ile sarıyoruz */}
          <View pointerEvents="none">
            <Text
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
  
  

  const hideInputArea = readOnly;
  const displayedMessages = readOnly ? currentConversation.messages : messages;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
                  keyboardShouldPersistTaps="always"
                  data={
                    loading
                      ? [...displayedMessages, { id: 'loading', text: dots, sender: 'bot' }]
                      : displayedMessages
                  }
                  keyExtractor={(item, index) =>
                    item.id ? item.id.toString() : `msg-${index}`
                  }
                  // renderItem kısmında her mesaj öğesini saran ekstra bir View ekledik.
                  // Bu ekstra View, onStartShouldSetResponderCapture={() => true} özelliğiyle
                  // dokunma olayını yakalayıp, FlatList'in scroll davranışına iletilmesine yardımcı olur.
                  renderItem={({ item }) => {
                    if (item.id === 'loading') {
                      return (
                        <View
                          style={styles.botContainer}
                          onStartShouldSetResponderCapture={() => true} // Eklenen satır
                        >
                          <Text style={[styles.loadingText, { color: theme.colors.text }]}>{dots}</Text>
                        </View>
                      );
                    }
                    return (
                      <View onStartShouldSetResponderCapture={() => true}> 
                        {renderMessageItem({ item })}
                      </View>
                    );
                  }}
                  style={styles.messageList}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />

          {/* Promptlar */}
          {!hideInputArea && showPrompts && inputText.trim().length === 0 && (
            <Image source={robotAssistant} style={styles.assistantImage} pointerEvents="none" />
          )}
          {!hideInputArea && showPrompts && inputText.trim().length === 0 && (
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

          {readOnly ? (
            // E-posta gönderim alanı (readOnly)
            <View style={styles.bottomContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.colors.inputBg,
                    borderColor: theme.colors.inputBorder,
                    borderWidth: theme.colors.inputBorder === 'transparent' ? 0 : 1,
                  },
                ]}
              >
                <TextInput
                  style={[styles.emailInput, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
                  placeholder={i18n.t('send_history.email_placeholder')}
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  editable={true}
                />
                <TouchableOpacity
                  onPress={handleSendHistory}
                  style={[styles.emailButton, { backgroundColor: theme.colors.primary, marginLeft: 8 }]}
                  disabled={mailLoading}
                >
                  <Text style={styles.emailButtonText}>
                    {mailLoading ? i18n.t('send_history.sending') : i18n.t('send_history.send')}
                  </Text>
                </TouchableOpacity>
              </View>
              {mailError && (
                <Text style={styles.errorText}>{mailError}</Text>
              )}
            </View>
          ) : (
            // Normal mesaj gönderme alanı (readOnly değilse)
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
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
    pointerEvents: 'none',
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    height: 50,
    paddingVertical: 8,
  },
  emailButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emailButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 16,
  },
});
