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
  Chip,
} from 'react-native-paper';
import { apiClient } from '../../services/api/client';

export default function AssociationInfo({ user }) {
  const [associationName, setAssociationName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Statistiques
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalProducts: 0,
    totalCategories: 0,
  });

  // Valeurs initiales
  const [initialData, setInitialData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    loadAssociationInfo();
    loadStatistics();
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
      setAssociationName(user.association_name || '');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // Charger les statistiques en parallèle
      const [usersRes, productsRes, categoriesRes] = await Promise.all([
        apiClient('/users').catch(() => ({ data: [] })),
        apiClient('/products').catch(() => ({ data: [] })),
        apiClient('/categories').catch(() => ({ data: [] })),
      ]);

      // Filtrer par association
      const associationUsers =
        usersRes.data?.filter(u => u.association_id === user.association_id) ||
        [];

      const associationProducts =
        productsRes.data?.filter(
          p => p.association_id === user.association_id,
        ) || [];

      setStats({
        totalMembers: associationUsers.length,
        activeMembers: associationUsers.filter(u => u.is_active).length,
        totalProducts: associationProducts.length,
        totalCategories: categoriesRes.data?.length || 0,
      });
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    }
  };

  const hasChanges = () => {
    return (
      associationName !== initialData.name ||
      address !== initialData.address ||
      phone !== initialData.phone
    );
  };

  const handleSave = async () => {
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

  const calculateAnciennete = dateString => {
    if (!dateString) return 'N/A';

    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0
        ? `${years} an${years > 1 ? 's' : ''} et ${months} mois`
        : `${years} an${years > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#457b9d" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Informations générales */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informations générales</Text>

          <TextInput
            label="Nom de l'association"
            value={associationName}
            onChangeText={setAssociationName}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: '#457b9d',
              },
            }}
          />

          <TextInput
            label="Adresse"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.input}
            theme={{
              colors: {
                primary: '#457b9d',
              },
            }}
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
            theme={{
              colors: {
                primary: '#457b9d',
              },
            }}
          />

          <Divider style={styles.divider} />

          <View style={styles.readOnlySection}>
            <Text style={styles.readOnlyLabel}>Email de contact</Text>
            <View style={styles.readOnlyValueContainer}>
              <Text style={styles.readOnlyValue}>{email}</Text>
            </View>
            <Text style={styles.readOnlyHelper}>
              💡 L'email est lié à votre compte et ne peut pas être modifié
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving || !hasChanges()}
            style={styles.saveButton}
            buttonColor="#457b9d"
          >
            Enregistrer les modifications
          </Button>
        </Card.Content>
      </Card>

      {/* Statistiques */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalMembers}</Text>
              <Text style={styles.statLabel}>Membres inscrits</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.activeMembers}</Text>
              <Text style={styles.statLabel}>Membres actifs</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalCategories}</Text>
              <Text style={styles.statLabel}>Catégories</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Membre depuis</Text>
            <Chip
              mode="outlined"
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {calculateAnciennete(createdAt)}
            </Chip>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#457b9d',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#626c6c',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#626c6c',
  },
  chip: {
    backgroundColor: '#fff',
    borderColor: '#457b9d',
    borderWidth: 1,
  },
  chipText: {
    color: '#457b9d',
    fontWeight: '600',
  },
});
