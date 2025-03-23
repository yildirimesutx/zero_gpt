import { useState } from 'react';
import Constants from 'expo-constants';
import {BASE_URL} from './baseURL';

const API_URL = Constants.expoConfig.extra.aiApiUrl;
const API_KEY = Constants.expoConfig.extra.aiApiKey;


const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage, deepSearch = false) => {
    if (!userMessage.trim()) return;
    const userMessageId = Date.now();
    const newUserMessage = {
      id: userMessageId.toString(),
      text: userMessage,
      sender: 'user',
    };

    // Kullanıcı mesajını state'e ekle
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      let data = {};
      if (deepSearch) {
        // Derin arama endpoint'ine istek gönderiliyor
        const response = await fetch(`${BASE_URL}/api/send/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });
        console.log("derin",response )
        const responseText = await response.text();
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('JSON Parse Error (Deep Search):', parseError, 'Response text:', responseText);
        }
      } else {
        // Normal endpoint'e istek gönderiliyor
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-functions-key': API_KEY,
          },
          body: JSON.stringify({
            "user-prompt": userMessage,
            "message-id": userMessageId,
          }),
        });

        console.log("standart",response )
        const responseText = await response.text();
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('JSON Parse Error (Normal):', parseError, 'Response text:', responseText);
        }
      }

      // Bot yanıtı oluşturuluyor
      const botReply = {
        id: (data.message_id ? data.message_id.toString() : Date.now().toString()) + '-bot',
        text: data.response || 'Cevap alınamadı.',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, setMessages };
};

export default useChatBot;
