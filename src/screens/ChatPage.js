import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import i18n from '../i18n/i18n';

const ChatPage = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const renderMessageItem = ({ item }) => {
    return (
      <View style={styles.messageBubble}>
        <Text style={[styles.messageText, { color: theme.colors.text }]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
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
              borderWidth:
                theme.colors.inputBorder === 'transparent' ? 0 : 1,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: theme.colors.text },
            ]}
            placeholder={i18n.t('placeholder_message')}
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity onPress={handleSend} style={styles.iconWrapper}>
            <Ionicons name="send" size={20} color={theme.colors.text} />
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
  messageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  bottomContainer: {
    padding: 10,
    backgroundColor: 'transparent',
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
    // Sadece dikey ortalama (vertical center):
    textAlign: 'left',         // Yatayda soldan başla
    textAlignVertical: 'center', 
    // iOS 13+ ve Android'de multiline'da dikey ortalama
  },
  iconWrapper: {
    marginLeft: 8,
  },
});
