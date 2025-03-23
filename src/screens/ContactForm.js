import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../i18n/i18n';
import useSendEmail from '../hooks/useSendEmail';
import { useTheme } from '../theme/ThemeProvider';

const ContactForm = () => {
  const { colors } = useTheme();
  const { sendEmail, loading } = useSendEmail();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Zorunlu alanlar: name, email, message
    if (!formData.name || !formData.email || !formData.message) {
      setError(i18n.t('contactForm.errors.requiredFields'));
      return;
    }
    setError('');
    setSuccess(false);

    const response = await sendEmail(formData, i18n.language);

    if (response.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ name: '', email: '', title: '', company: '', message: '' });
    } else {
      setError(response.error || i18n.t('contactForm.errors.submitError'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}>{i18n.t('contactForm.title')}</Text>
      
      <FormField 
        label={i18n.t('contactForm.name')}
        field="name"
        value={formData.name}
        onChange={handleChange}
        colors={colors}
      />
      <FormField 
        label={i18n.t('contactForm.email')}
        field="email"
        value={formData.email}
        onChange={handleChange}
        colors={colors}
      />
      <FormField 
        label={i18n.t('contactForm.subject')}
        field="title"
        value={formData.title}
        onChange={handleChange}
        colors={colors}
      />
      <FormField 
        label={i18n.t('contactForm.company')}
        field="company"
        value={formData.company}
        onChange={handleChange}
        colors={colors}
      />
      <FormField 
        label={i18n.t('contactForm.message')}
        field="message"
        value={formData.message}
        onChange={handleChange}
        isTextarea
        colors={colors}
      />

      {error ? <Text style={[styles.errorText, { color: colors.error || 'red' }]}>{error}</Text> : null}
      {success ? <Text style={[styles.successText, { color: colors.success || 'green' }]}>{i18n.t('contactForm.successMessage')}</Text> : null}

      <TouchableOpacity 
        style={[styles.submitButton, { backgroundColor: colors.primary }, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <Text style={styles.submitButtonText}>{i18n.t('contactForm.sending')}</Text>
            <ActivityIndicator color="#FFF" style={{ marginLeft: 8 }} />
          </>
        ) : (
          <>
            <Text style={styles.submitButtonText}>{i18n.t('contactForm.submitButton')}</Text>
            <Ionicons name="send" size={24} color="#FFF" style={{ marginLeft: 8 }} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const FormField = ({ label, field, value, onChange, isTextarea = false, colors }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
    <TextInput
      style={[
        styles.fieldInput,
        { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
        isTextarea && styles.textarea
      ]}
      value={value}
      onChangeText={(text) => onChange(field, text)}
      placeholder={label}
      placeholderTextColor={colors.placeholder || "#999"}
      multiline={isTextarea}
      autoCapitalize="none"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,  
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 60,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  fieldInput: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textarea: {
    height: 96,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    marginBottom: 8,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactForm;
