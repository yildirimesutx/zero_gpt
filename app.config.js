import 'dotenv/config';

export default {
  expo: {
    name: "zero_gpt",
    slug: "zero_gpt",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    experiments: {
      turboModules: false
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      aiApiUrl: process.env.AI_API_URL,  
      aiApiKey: process.env.AI_API_KEY   
    },
    plugins: ["expo-localization"]
  }
};
