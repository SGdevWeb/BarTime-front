// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import { authService } from '../services/api/auth';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.success && response.user) {
        console.log('✅ Connexion réussie:', response.user.username);
        onLoginSuccess(response.user);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('❌ Erreur login:', err);

      let message = 'Impossible de se connecter';
      if (err.message.includes('401')) {
        message = 'Email ou mot de passe incorrect';
      } else if (err.message.includes('Network')) {
        message = 'Vérifiez votre connexion internet';
      }

      Alert.alert('Erreur de connexion', message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BarTime</Text>
          <Text style={styles.subtitle}>La buvette digitale de votre club</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="contact@votre-asso.fr"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrors({ ...errors, email: null, general: null });
              }}
              style={[styles.input, errors.email && styles.inputError]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
            {errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              placeholder="Votre mot de passe"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrors({ ...errors, password: null, general: null });
              }}
              style={[styles.input, errors.password && styles.inputError]}
              secureTextEntry
              autoComplete="password"
              editable={!loading}
            />
            {errors.password && (
              <HelperText type="error">{errors.password}</HelperText>
            )}
          </View>

          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() =>
              Alert.alert('Mot de passe oublié', 'Fonctionnalité à venir')
            }
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Erreur générale */}
          {errors.general && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errors.general}</Text>
            </View>
          )}

          {/* Bouton connexion */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          {/* Séparateur */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Bouton inscription */}
          <TouchableOpacity
            onPress={onNavigateToRegister}
            disabled={loading}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>
              Pas encore de compte ?{' '}
              <Text style={styles.registerTextBold}>
                Créer un compte gratuitement
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En vous connectant, vous acceptez nos{' '}
            <Text style={styles.footerLink}>conditions d'utilisation</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#e63946',
    backgroundColor: '#fff5f5',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#457b9d',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#e63946',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#e63946',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#457b9d',
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
  },
  registerButton: {
    paddingVertical: 12,
  },
  registerText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 15,
  },
  registerTextBold: {
    color: '#457b9d',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  footerLink: {
    color: '#457b9d',
    textDecorationLine: 'underline',
  },
});
