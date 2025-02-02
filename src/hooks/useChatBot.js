import { useState } from 'react';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.aiApiUrl;
const API_KEY = Constants.expoConfig.extra.aiApiKey;

const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();
      const botReply = {
        id: Date.now().toString() + '-bot',
        text: data.choices[0].message.content || 'Cevap alınamadı.',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};

export default useChatBot;
