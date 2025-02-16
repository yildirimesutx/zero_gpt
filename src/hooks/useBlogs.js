// src/hooks/useBlogs.js
import { useState, useEffect } from 'react';
import {BASE_URL} from './baseURL';
import i18n from '../i18n/i18n';

const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cihaz diline göre language parametresini ayarlıyoruz.
  const language = i18n.locale.startsWith('tr') ? 'tr' : 'en';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // URL'yi bir değişkene atıyoruz
        const url = `${BASE_URL}/api/blogs?language=${language}`;
        console.log("Fetching blogs from URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // console.log("Result:", result);
        // API'den gelen response içinde "data" alanı varsa onu kullanıyoruz.
        setBlogs(result.data || []);
      } catch (err) {
        console.error('Blog fetching error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [language]);

  return { blogs, loading, error };
};

export default useBlogs;
