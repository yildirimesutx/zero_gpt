import { useState } from 'react';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.aiApiUrl;
const API_KEY = Constants.expoConfig.extra.aiApiKey;

const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Kullanıcı mesajı için ID üretimi: sadece metin gönderiliyor.
    const userMessageId = Date.now();
    const newUserMessage = {
      id: userMessageId.toString(),
      text: userMessage,
      sender: 'user',
    };

    // API isteği yapılmadan önce yerel mesaj state güncelleniyor.
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // API_KEY artık URL parametresi olarak ekleniyor.
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key' : API_KEY
        },
        body: JSON.stringify({
          "user-prompt": userMessage,
          "message-id": userMessageId,
        }),
      });

      // Yanıtı önce text olarak okuyup, sonra JSON'a çeviriyoruz.
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Response text:', responseText);
      }

      // API response formatı:
      // { "message_id": 1, "response": "Cevap metni..." }
      const botReply = {
        id: data.message_id ? data.message_id.toString() + '-bot' : Date.now().toString() + '-bot',
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

  return { messages, sendMessage, loading };
};

export default useChatBot;
