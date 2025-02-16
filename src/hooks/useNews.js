// src/hooks/useBlogs.js
import { useState, useEffect } from 'react';
import {BASE_URL} from './baseURL';
import i18n from '../i18n/i18n';

const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const language = i18n.locale.startsWith('tr') ? 'tr' : 'en';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/api/blogs/category/haberler?language=${language}`;
        console.log("Fetching news from URL:", url);


        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
       
        setNews(result.data || []);
      } catch (err) {
        console.error('Blog fetching error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [language]);

  return { news, loading, error };
};

export default useNews;
