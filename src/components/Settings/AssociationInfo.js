// src/components/Settings/AssociationInfo.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { apiClient } from '../../services/api/client';

export default function AssociationInfo({ user }) {
  const [associationName, setAssociationName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trialEndsAt, setTrialEndsAt] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Valeurs initiales
  const [initialData, setInitialData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    loadAssociationInfo();
  }, []);

  const loadAssociationInfo = async () => {
    try {
      setLoading(true);

      const response = await apiClient(`/associations/${user.association_id}`);

      if (response.success) {
        const association = response.data;
        const name = association.name || '';
        const addr = association.address || '';
        const ph = association.phone || '';

        setAssociationName(name);
        setAddress(addr);
        setPhone(ph);
        setEmail(user.email || '');
        setTrialEndsAt(association.trial_ends_at || '');
        setSubscriptionStatus(association.subscription_status || 'trial');
        setCreatedAt(association.created_at || '');

        setInitialData({
          name,
          address: addr,
          phone: ph,
        });
      }
    } catch (err) {
      console.error('Erreur chargement association : ', err);
      setEmail(user.email || '');
      setAssociationName(user.assocation_name || '');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier di des modifications ont été faites
  const hasChanges = () => {
    return (
      associationName !== initialData.name ||
      address !== initialData.address ||
      phone !== initialData.phone
    );
  };

  const handleSave = async () => {
    // Validation
    if (!associationName.trim()) {
      alert("❌ Le nom de l'association est requis");
      return;
    }

    if (!address.trim()) {
      alert("❌ L'adresse est requise");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient(`/associations/${user.association_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: associationName,
          address,
          phone,
        }),
      });

      if (response.success) {
        setInitialData({
          name: associationName,
          address,
          phone,
        });
        alert('✅ Informations mises à jour');
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informations générales</Text>

          <TextInput
            label="Nom de l'association"
            value={associationName}
            onChangeText={setAssociationName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Adresse"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.input}
          />

          <TextInput
            label="Téléphone"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            placeholder="01 23 45 67 89"
            left={<TextInput.Icon icon="phone" />}
          />

          <Divider style={styles.divider} />

          <View style={styles.readOnlySection}>
            <Text style={styles.readOnlyLabel}>Email de contact</Text>
            <View style={styles.readOnlyValueContainer}>
              <Text style={styles.readOnlyValue}>{email}</Text>
            </View>
            <Text style={styles.readOnlyHelper}>
              💡 Pour modifier l'email, rendez-vous dans "Mon compte"
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving || !hasChanges()}
            style={styles.saveButton}
            buttonColor="#e63946"
          >
            Enregistrer les modifications
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Abonnement</Text>

          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionLabel}>Plan actuel :</Text>
            <Text style={styles.subscriptionValue}>
              {subscriptionStatus === 'trial' ? 'Essai gratuit' : 'Premium'}
            </Text>
          </View>

          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionLabel}>
              {subscriptionStatus === 'trial'
                ? 'Expire le :'
                : 'Renouvelé le :'}
            </Text>
            <Text style={styles.subscriptionValue}>
              {formatDate(trialEndsAt)}
            </Text>
          </View>

          {subscriptionStatus === 'trial' && (
            <Button
              mode="outlined"
              style={styles.upgradeButton}
              icon="rocket-launch"
              onPress={() => alert('🚀 Fonctionnalité à venir')}
            >
              Passer à la version Premium
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Informations complémentaires */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Statistiques</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ID Association</Text>
            <Text style={styles.statValue}>{user.association_id}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Compte créé le</Text>
            <Text style={styles.statValue}>{formatDate(createdAt)}</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#626c6c',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2121',
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  readOnlySection: {
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 12,
    color: '#626c6c',
    marginBottom: 4,
    fontWeight: '500',
  },
  readOnlyValueContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  readOnlyValue: {
    fontSize: 16,
    color: '#1f2121',
  },
  readOnlyHelper: {
    fontSize: 11,
    color: '#626c6c',
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: 8,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  subscriptionLabel: {
    fontSize: 14,
    color: '#626c6c',
  },
  subscriptionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2121',
  },
  upgradeButton: {
    marginTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#626c6c',
  },
  statValue: {
    fontSize: 14,
    color: '#1f2121',
  },
});
