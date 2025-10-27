// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import { authService } from '../services/api/auth';

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}) {
  // État pour l'association
  const [associationName, setAssociationName] = useState('');
  const [address, setAddress] = useState('');

  // État pour l'administrateur
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!associationName.trim()) newErrors.associationName = 'Nom requis';
    if (!address.trim()) newErrors.address = 'Adresse requise';

    if (!firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.registerAssociation({
        // Association
        associationName,
        address,

        // Admin
        firstName,
        lastName,
        email,
        password,
      });

      if (response.success) {
        Alert.alert(
          '🎉 Inscription réussie !',
          `Bienvenue ${firstName} !\n\nVotre période d'essai de 2 mois commence maintenant.\n\nVous pouvez dès à présent utiliser BarTime pour gérer votre association.`,
          [
            {
              text: 'Commencer',
              onPress: () => onRegisterSuccess(response.user),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de créer le compte. Veuillez réessayer.',
      );
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
      >
        <Text style={styles.title}>Créer votre compte</Text>
        <Text style={styles.subtitle}>
          Profitez de 2 mois d'essai gratuit pour gérer votre association
        </Text>

        {/* Section Association */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Votre association</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de l'association *</Text>
            <TextInput
              placeholder="Ex: Pétanque Saint Saulvienne"
              value={associationName}
              onChangeText={setAssociationName}
              style={[
                styles.input,
                errors.associationName && styles.inputError,
              ]}
            />
            {errors.associationName && (
              <HelperText type="error">{errors.associationName}</HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              placeholder="44 Rue Henri Barbusse, 59880 Saint-Saulve"
              value={address}
              onChangeText={setAddress}
              style={[styles.input, errors.address && styles.inputError]}
              multiline
            />
            {errors.address && (
              <HelperText type="error">{errors.address}</HelperText>
            )}
          </View>
        </View>

        {/* Section Administrateur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Vos informations</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                placeholder="Samuel"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, errors.firstName && styles.inputError]}
              />
              {errors.firstName && (
                <HelperText type="error">{errors.firstName}</HelperText>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                placeholder="Gustin"
                value={lastName}
                onChangeText={setLastName}
                style={[styles.input, errors.lastName && styles.inputError]}
              />
              {errors.lastName && (
                <HelperText type="error">{errors.lastName}</HelperText>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              placeholder="contact@votre-asso.fr"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, errors.email && styles.inputError]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              placeholder="Minimum 8 caractères"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, errors.password && styles.inputError]}
              secureTextEntry
            />
            {errors.password && (
              <HelperText type="error">{errors.password}</HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              placeholder="Répétez le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <HelperText type="error">{errors.confirmPassword}</HelperText>
            )}
          </View>
        </View>

        {/* Conditions */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <View
            style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
          >
            {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            J'accepte les{' '}
            <Text style={styles.link}>conditions d'utilisation</Text> et la{' '}
            <Text style={styles.link}>politique de confidentialité</Text>
          </Text>
        </TouchableOpacity>
        {errors.terms && (
          <HelperText type="error" style={{ marginTop: -8 }}>
            {errors.terms}
          </HelperText>
        )}

        {/* Boutons */}
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {loading ? 'Création en cours...' : "🚀 Commencer l'essai gratuit"}
        </Button>

        <TouchableOpacity
          onPress={onNavigateToLogin}
          disabled={loading}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>
            Vous avez déjà un compte ?{' '}
            <Text style={styles.loginLinkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
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
    padding: 15,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1d3557',
    marginBottom: 8,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#457b9d',
    borderColor: '#457b9d',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  link: {
    color: '#457b9d',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#457b9d',
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginLink: {
    paddingVertical: 12,
  },
  loginLinkText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 15,
  },
  loginLinkBold: {
    color: '#457b9d',
    fontWeight: 'bold',
  },
});
