// src/hooks/useBlogs.js
import { useState, useEffect } from 'react';
import {BASE_URL} from './baseURL';
import i18n from '../i18n/i18n';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cihaz diline göre language parametresini ayarlıyoruz.
  const language = i18n.locale.startsWith('tr') ? 'tr' : 'en';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // URL'yi bir değişkene atıyoruz
        const url = `${BASE_URL}/api/projects?language=${language}`;
        console.log("Fetching blogs from URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // console.log("Result:", result);
        // API'den gelen response içinde "data" alanı varsa onu kullanıyoruz.
        setProjects(result.data?.projects || []);
      } catch (err) {
        console.error('Blog fetching error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  return { projects, loading, error };
};

export default useProjects;
