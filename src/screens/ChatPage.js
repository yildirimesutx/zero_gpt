import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import useChatBot from '../hooks/useChatBot';
import i18n from '../i18n/i18n';

const ChatPage = () => {
  const theme = useTheme();
  const { messages, sendMessage, loading } = useChatBot();
  const [inputText, setInputText] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    sendMessage(inputText);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userContainer : styles.botContainer]}>
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user'
            ? { backgroundColor: theme.colors.userBubble } // Kullanıcı balon rengi
            : styles.botMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.sender === 'user'
                ? (theme.colors.background === '#FFFFFF' ? '#000' : '#FFF') // Kullanıcı yazı rengi
                : theme.colors.text,
            },
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={loading ? [...messages, { id: 'loading', text: `${dots}`, sender: 'bot' }] : messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.id === 'loading' ? (
            <View style={styles.botContainer}>
              <Text style={styles.loadingText}>{dots}</Text>
            </View>
          ) : (
            renderMessageItem({ item })
          )
        }
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

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
            placeholderTextColor={theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity onPress={handleSend} style={[styles.iconWrapper, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="send" size={20} color={'#FFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
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
    backgroundColor: 'transparent',
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
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  iconWrapper: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 20,
  },
  // **📌 Loading animasyonu için büyük nokta stili**
  loadingText: {
    fontSize: 24, // **Daha büyük nokta büyüklüğü**
    fontWeight: 'bold',
    
    paddingHorizontal: 16,
    textAlign: 'left',
  },
});
