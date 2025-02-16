// src/hooks/useBlogs.js
import { useState, useEffect } from 'react';
import {BASE_URL} from './baseURL';
import i18n from '../i18n/i18n';

const useProjectDetail = (slug) => {
  const [projectDetail, setProjectDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const language = i18n.locale.startsWith('tr') ? 'tr' : 'en';

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL}/api/projects/${slug}?language=${language}`;
        console.log("Fetching blogs from URL:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        setProjectDetail(result.data || []);
      } catch (err) {
        console.error('Blog fetching error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [language]);

  return { projectDetail, loading, error };
};

export default useProjectDetail;
