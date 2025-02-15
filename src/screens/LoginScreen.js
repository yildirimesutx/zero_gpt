import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import i18n from '../i18n/i18n';

const LoginScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Şifrenin görünürlüğünü kontrol eden state (false: gizli, true: görünür)
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    console.log('Login:', email, password);
  };

  const handleGoogleLogin = () => {
    console.log('Google ile Devam Et');
  };

  // Dark tema kontrolü: Eğer background "#000000" ise dark tema olarak kabul edelim.
  const isDark = theme.colors.background === '#000000';

  // Google butonunun stillerini koşullu olarak belirleyelim.
  const googleButtonBackground = isDark ? "#2A2929" : "#fff";
  const googleButtonBorderWidth = isDark ? 0 : 1;
  const googleButtonTextColor = isDark ? "#FFFFFF" : "#4285F4";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo-dark-text.png')} // Logonuzu buraya ekleyin.
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Input Alanları */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: "#ccc", 
              color: theme.colors.text 
            }
          ]}
          placeholder="Email"
          placeholderTextColor={theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Parola Inputu */}
        <View style={[styles.passwordWrapper, { borderColor: "#ccc" }]}>
          <TextInput
            style={[styles.input, styles.passwordInput, { color: theme.colors.text }]}
            placeholder={i18n.t('placeholder_pass')}
            placeholderTextColor={theme.colors.text === '#FFFFFF' ? '#aaa' : '#555'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(prev => !prev)}
            style={styles.iconWrapper}
          >
            <Ionicons 
              name={passwordVisible ? "eye-off" : "eye"} 
              size={20} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Butonu (sabit renk: "#6ABE4E") */}
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: "#6ABE4E" }]}
        onPress={handleLogin}
      >
        <Text style={[styles.loginButtonText, { color: "#FFFFFF" }]}>
           {i18n.t('login')}
        </Text>
      </TouchableOpacity>

      {/* Google ile Devam Et Butonu */}
      <TouchableOpacity 
        style={[
          styles.googleButton, 
          { 
            backgroundColor: googleButtonBackground,
            borderColor: "#4285F4",
            borderWidth: googleButtonBorderWidth
          }
        ]}
        onPress={handleGoogleLogin}
      >
        <Image 
          source={require('../../assets/google-logo.png')} // Google logosu
          style={styles.google_logo}
          resizeMode="contain"
        />
        <Text style={[styles.googleButtonText, { color: googleButtonTextColor }]}>
        {i18n.t('login_google')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  inputContainer: {
    marginBottom: 70,
  },
  input: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 5,
    marginVertical: 10,
    // Sadece alt border
    borderBottomWidth: 1,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // Sadece wrapper'da alt border olacak
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  // Parola inputunun kendi alt border'ını kaldırıyoruz:
  passwordInput: {
    flex: 1,
    borderBottomWidth: 0,
  },
  iconWrapper: {
    padding: 10,
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  google_logo: {
    width: 20,
    height: 20,
    marginEnd: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
