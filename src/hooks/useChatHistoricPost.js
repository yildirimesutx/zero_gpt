// useChatHistoricPost.js
import { useState } from 'react';
import {BASE_URL} from './baseURL';

export default function useChatHistoricPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sohbeti mail olarak gönderme fonksiyonu
  async function sendHistoricMail(email, conversationMessages) {
    setLoading(true);
    setError(null);

    try {
      // 1) messages dizisini API’nin istediği formata dönüştür (user-bot ikilileri)
      const dataPairs = transformMessagesToPairs(conversationMessages);

      // 2) Gönderilecek body
      const body = {
        email,
        type: "chatbot",
        data: dataPairs,
        language: "tr"
      };

      const url = `${BASE_URL}/api/send/email`;
      // 3) POST isteği
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`Mail gönderme hatası: ${res.statusText}`);
      }

      // Başarılı ise burada isterseniz bir “başarı” durumunu tutabilirsiniz
      console.log("Mail başarıyla gönderildi.");
      
    } catch (err) {
      setError(err.message);
      console.log("sendHistoricMail error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Mesajları [{ user: "...", bot: "..." }, ...] haline dönüştürme
  function transformMessagesToPairs(messages) {
    const result = [];
    let pair = null;

    messages.forEach((msg) => {
      if (msg.sender === 'user') {
        // Yeni bir pair başlat (önceki pair pushlanmamışsa, pushla)
        // ya da devam ediyorsa orada bot boş kalmış olabilir.
        pair = { user: msg.text, bot: null };
      } else {
        // bot mesajı
        if (!pair) {
          // Ortada user yoksa tek başına bot 
          pair = { user: null, bot: msg.text };
          result.push(pair);
          pair = null;
        } else {
          // mevcut pair’in bot’unu doldur
          pair.bot = msg.text;
          result.push(pair);
          pair = null;
        }
      }
    });

    // Eğer son user mesajı bot cevabı olmadan kaldıysa pushla
    if (pair) {
      result.push(pair);
    }

    return result;
  }

  return {
    sendHistoricMail,
    loading,
    error
  };
}
