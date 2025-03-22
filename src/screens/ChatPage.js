import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

// YENİ HOOK
import useChatHistoricPost from '../hooks/useChatHistoricPost';

const ChatPage = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const conversationId = route.params?.conversationId || null;
  const readOnly = route.params?.readOnly || false;
  const newConversation = route.params?.newConversation || false;

  const { messages, sendMessage, loading, setMessages } = useChatBot();

  // --- YENİ: Post hook'u
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

  // Eklenen: email state (sadece readOnly modunda gözükecek)
  const [email, setEmail] = useState('');

  const prompts = [
    { title: "Sıfır Atık Nedir?", description: "Atık üretimini en aza indirerek çevreyi koruyun." },
    { title: "Geri Dönüşüm", description: "Kullanılan malzemeleri yeniden değerlendirin." },
    { title: "Sürdürülebilir Yaşam", description: "Doğayla uyumlu, uzun vadeli çözümler üretin." },
    // ...
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={24} color={theme.colors.headerText} />
        </TouchableOpacity>
      ),
      headerTitle: "ZeroGPT",
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

  // Parametre kontrolü
  useEffect(() => {
    if (readOnly && conversationId) {
      loadOldConversation(conversationId);
    } else if (newConversation) {
      setMessages([]);
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

  // Mesaj değiştikçe kaydet
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
    sendMessage(inputText);
    setInputText('');
    setShowPrompts(false);
  };

  const handlePromptPress = (promptTitle) => {
    sendMessage(promptTitle);
    setInputText('');
    setShowPrompts(false);
  };

  // YENİ: Geçmişi gönder butonu tıklandığında
  const handleSendHistory = async () => {
    if (!email.trim()) {
      Alert.alert("Uyarı", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
    // currentConversation.messages'i mail olarak gönder
    await sendHistoricMail(email, currentConversation.messages);
    if (!mailError) {
      Alert.alert("Bilgi", "Konuşma geçmişi başarıyla gönderildi.");
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
        >
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
    );
  };

  // readOnly => normal inputu gizliyoruz
  const hideInputArea = readOnly;
  // Eğer readOnly ise bu ekranda messages => currentConversation.messages
  const displayedMessages = readOnly
    ? currentConversation.messages
    : messages;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Üst kısımdaki header yüksekliğine göre ayarlayın
    >
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={
          loading
            ? [...displayedMessages, { id: 'loading', text: dots, sender: 'bot' }]
            : displayedMessages
        }
        keyExtractor={(item, index) => item.id ? item.id.toString() : `msg-${index}`}
        renderItem={({ item }) => {
          if (item.id === 'loading') {
            return (
              <View style={styles.botContainer}>
                <Text style={styles.loadingText}>{dots}</Text>
              </View>
            );
          }
          return renderMessageItem({ item });
        }}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* readOnly DEĞİLSE promptları göster */}
      {!hideInputArea && showPrompts && inputText.trim().length === 0 && (
        <Image
          source={robotAssistant}
          style={styles.assistantImage}
          pointerEvents="none"
        />
      )}
      {!hideInputArea && showPrompts && inputText.trim().length === 0 && (
        <View style={styles.promptsContainer}>
          <FlatList
            data={prompts}
            horizontal
            keyExtractor={(item, idx) => `${idx}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.promptItem,
                  { backgroundColor: theme.colors.inputBg },
                ]}
                onPress={() => handlePromptPress(item.title)}
              >
                <Text style={[styles.promptTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.promptDescription, { color: theme.colors.text }]}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* eğer readOnly ise normal input yok, onun yerine e-posta gönderme arayüzü */}
      {readOnly ? (
        <View style={styles.bottomContainer}>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: '#f0f0f0',
                borderColor: theme.colors.inputBorder,
                borderWidth: theme.colors.inputBorder === 'transparent' ? 0 : 1,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: '#000' }]}
              placeholder="E-posta adresiniz"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={handleSendHistory}
              style={[
                styles.iconWrapper,
                { backgroundColor: theme.colors.primary },
              ]}
              disabled={mailLoading}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                {mailLoading ? 'Gönderiliyor...' : 'Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
          {mailError && (
            <Text style={{ color: 'red', marginTop: 4, marginLeft: 16 }}>
              {mailError}
            </Text>
          )}
        </View>
      ) : (
        /* readOnly değilse normal input */
        <View style={styles.bottomContainer}>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                borderWidth: theme.colors.inputBorder === 'transparent' ? 0 : 1,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder={i18n.t('placeholder_message')}
              placeholderTextColor={
                theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'
              }
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                if (text.trim().length > 0) {
                  setShowPrompts(false);
                }
              }}
              multiline
            />

            <TouchableOpacity
              onPress={handleSend}
              style={[
                styles.iconWrapper,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  iconWrapper: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 20,
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
    top: '25%',
    alignSelf: 'center',
    opacity: 0.5,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
    pointerEvents: 'none',
  },
});
