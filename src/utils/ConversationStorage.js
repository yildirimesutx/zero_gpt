// src/utils/ConversationStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONVERSATIONS_KEY = 'conversations';

// Yeni bir konuşma (conversation) ekler
export const saveConversation = async (conversation) => {
  try {
    const existing = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    const conversations = existing ? JSON.parse(existing) : [];
    
    conversations.push(conversation);
    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
};

// Tüm konuşmaları yükler
const loadConversations = async () => {
  try {
    const existing = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    if (!existing || existing.trim() === '') {
      return [];
    }
    return JSON.parse(existing);
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

