import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';

// 1) I18n sınıfından bir örnek oluşturuyoruz.
const i18n = new I18n({
  en,
  tr,
});

// 2) Varsayılan dil (sisteminize göre değiştirebilirsiniz)
i18n.defaultLocale = 'en';

// 3) Cihazın anlık dil bilgisini atayalım
i18n.locale = Localization.locale; 
// Örnek: "en-US", "tr-TR"

// 4) Fallback aktif edelim. (i18n.enableFallback = true; yeni sürümlerde bu isimde olabilir)
i18n.enableFallback = true;

// (Eğer eski sürüm kullanıyorsanız `i18n.fallbacks = true;` yazmanız gerekebilir.)

export default i18n;
