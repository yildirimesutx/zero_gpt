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
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.yourcompany.zero_gpt", // Eklenen alan: Uygulamanız için benzersiz paket adı
      versionCode: 3,    
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      aiApiUrl: process.env.AI_API_URL,  
      aiApiKey: process.env.AI_API_KEY,
      eas: {
        projectId: "7e2e18b8-fb20-4cbd-a550-33b043b3b63f"
      }   
    },
    plugins: ["expo-localization"]
  }
};
