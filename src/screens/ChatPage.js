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

  // Derin arastirma butonunun aktifliğini kontrol eden state
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

  // readOnly modunda e-posta için state
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

  // Konuşma geçmişi yükleme veya yeni konuşma oluşturma
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

  // Mesaj değiştikçe conversation'ı kaydet
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

  // Mesaj gönderme işlemi, deepSearchActive durumuna göre ilgili endpoint'e yönlendirir.
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

  // Geçmişi gönder butonu
  const handleSendHistory = async () => {
    if (!email.trim()) {
      Alert.alert("Uyarı", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }
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

  // readOnly modunda input alanı gizlenir
  const hideInputArea = readOnly;
  // Eğer readOnly ise messages, currentConversation.messages olarak gösterilir
  const displayedMessages = readOnly ? currentConversation.messages : messages;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
                  <Text style={[styles.loadingText, { color: theme.colors.text }]}>{dots}</Text>
                </View>
              );
            }
            return renderMessageItem({ item });
          }}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Promptlar */}
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

        {readOnly ? (
          // E-posta gönderme arayüzü (readOnly modunda)
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
          // Normal input alanı (readOnly değilse)
          // Mevcut input arka plan stili korunarak; üst satırda metin girişi ve gönder butonu,
          // alt satırda derin arastirma butonu olacak şekilde düzenlendi.
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
              {/* İçeriği iki satıra yerleştirmek için ek container */}
              <View style={{ flexDirection: 'column', width: '100%' }}>
                {/* Üst satır: TextInput ve Gönder Butonu */}
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
                  />
                  <TouchableOpacity
                    onPress={handleSend}
                    style={[styles.iconWrapper, { backgroundColor: theme.colors.primary }]}
                  >
                    <Ionicons name="send" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
                {/* Alt satır: Derin Arastirma Butonu */}
                <View style={styles.deepSearchRow}>
                <TouchableOpacity
                  onPress={() => setDeepSearchActive(!deepSearchActive)}
                  style={[
                    styles.deepSearchButton,
                    {
                      borderColor: deepSearchActive
                        ? theme.colors.primary
                        : (theme.colors.background === '#000000' ? '#FFF' : '#000')
                    }
                  ]}
                >
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={deepSearchActive ? theme.colors.primary : theme.colors.text}
                  />
                  <Text style={{ marginLeft: 4, color: deepSearchActive ? theme.colors.primary : theme.colors.text }}>
                    Derin Arastirma
                  </Text>
                </TouchableOpacity>
                </View>
              </View>
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
  // Mevcut inputWrapper stili (arkaplan, border vs. aynı)
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  // Üst satır: TextInput ve gönder butonu
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // TextInput yüksekliğini iki katına çıkarıyoruz (örneğin 80)
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 60,
  },
  iconWrapper: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 20,
  },
  // Alt satır: Derin arastirma butonunun yer aldığı satır
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
