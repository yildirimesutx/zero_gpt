import { useState } from 'react';
import { BASE_URL } from './baseURL';

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendEmail = async (formData, language) => {
    setLoading(true);
    setError('');

    const payload = {
      email: formData.email,
      type: "contactForm",
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
      language: language || "tr",
    };

    try {
        const endpoint = BASE_URL + '/api/send/email';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("url",endpoint )


      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        return { success: true, data };
      } else {
        const errorMessage = data?.message || "Email gönderilemedi";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Email gönderme hatası:", err);
      const errorMessage = err.message || "Email gönderilemedi";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { sendEmail, loading, error };
};

export default useSendEmail;
