// src/components/Settings/MemberManagement.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import {
  List,
  Searchbar,
  FAB,
  Chip,
  Text,
  Portal,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
} from 'react-native-paper';
import { apiClient } from '../../services/api/client';

export default function MemberManagement({ user }) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await apiClient(
        `/users?association_id=${user.association_id}&role=adherent`,
      );

      if (response.success) {
        setMembers(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement adhérents:', err);
      Alert.alert('Erreur', 'Impossible de charger les adhérents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    // Validation
    if (!newMember.name.trim() || !newMember.surname.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont requis');
      return;
    }

    if (!newMember.email.trim()) {
      Alert.alert('Erreur', "L'email est requis");
      return;
    }

    if (!newMember.password || newMember.password.length < 6) {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 6 caractères',
      );
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient('/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName: newMember.name,
          lastName: newMember.surname,
          email: newMember.email,
          password: newMember.password,
        }),
      });

      if (response.success) {
        setModalVisible(false);
        setNewMember({ name: '', surname: '', email: '', password: '' });
        loadMembers();
        Alert.alert('Succès', 'Adhérent créé avec succès');
      }
    } catch (err) {
      console.error('Erreur création adhérent:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleEditMember = async () => {
    // Validation
    if (!newMember.name.trim() || !newMember.surname.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont requis');
      return;
    }

    if (!newMember.email.trim()) {
      Alert.alert('Erreur', "L'email est requis");
      return;
    }

    // 👇 NOUVEAU : Vérifier si l'email a changé
    const emailChanged = newMember.email.trim() !== editingMember.email;

    if (emailChanged) {
      Alert.alert(
        '⚠️ Attention',
        `Vous êtes sur le point de modifier l'email de connexion de ${
          editingMember.name
        }.\n\nNouveau email : ${newMember.email.trim()}\n\nL'adhérent devra utiliser ce nouvel email pour se connecter.\n\nContinuer ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Confirmer',
            onPress: () => performUpdate(),
          },
        ],
      );
    } else {
      performUpdate();
    }
  };

  const performUpdate = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: newMember.name.trim(),
        surname: newMember.surname.trim(),
        email: newMember.email.trim(),
      };

      if (newMember.password && newMember.password.trim()) {
        if (newMember.password.trim().length < 6) {
          Alert.alert(
            'Erreur',
            'Le mot de passe doit contenir au moins 6 caractères',
          );
          setSaving(false);
          return;
        }
        updateData.password = newMember.password.trim();
      }

      const response = await apiClient(`/users/${editingMember.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        setModalVisible(false);
        setEditingMember(null);
        setNewMember({ name: '', surname: '', email: '', password: '' });
        loadMembers();
        Alert.alert('Succès', 'Adhérent mis à jour avec succès');
      }
    } catch (err) {
      console.error('Erreur mise à jour adhérent:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = member => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ${member.name} ${member.surname} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient(`/users/${member.id}`, {
                method: 'DELETE',
              });

              if (response.success) {
                loadMembers();
                Alert.alert('Succès', 'Adhérent supprimé');
              }
            } catch (err) {
              console.error('Erreur suppression adhérent:', err);
              Alert.alert('Erreur', "Impossible de supprimer l'adhérent");
            }
          },
        },
      ],
    );
  };

  const openAddModal = () => {
    setEditingMember(null);
    setNewMember({ name: '', surname: '', email: '', password: '' });
    setModalVisible(true);
  };

  const openEditModal = member => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      surname: member.surname,
      email: member.email,
      password: '', // Ne pas pré-remplir le mot de passe
    });
    setModalVisible(true);
  };

  const filteredMembers = members.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Chargement des adhérents...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un adhérent..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView style={styles.list}>
        {filteredMembers.map(member => (
          <View key={member.id}>
            <List.Item
              title={`${member.name} ${member.surname}`}
              left={props => (
                <List.Icon {...props} icon="account-circle" color="#21808d" />
              )}
              right={() => (
                <View style={styles.rightContent}>
                  <Chip mode="outlined" compact style={styles.balanceChip}>
                    {parseFloat(member.balance || 0).toFixed(2)} €
                  </Chip>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => openEditModal(member)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor="#d32f2f"
                    onPress={() => handleDeleteMember(member)}
                  />
                </View>
              )}
              onPress={() => openEditModal(member)}
            />
            <Divider />
          </View>
        ))}

        {filteredMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Aucun adhérent trouvé</Text>
            {searchQuery ? (
              <Text style={styles.emptyStateDesc}>
                Essayez avec d'autres termes de recherche
              </Text>
            ) : (
              <Text style={styles.emptyStateDesc}>
                Appuyez sur + pour ajouter votre premier adhérent
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={openAddModal} color="#fff" />

      {/* Modal d'ajout/édition */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingMember(null);
          }}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingMember ? "Modifier l'adhérent" : 'Nouvel adhérent'}
          </Text>

          <TextInput
            label="Prénom"
            value={newMember.name}
            onChangeText={text => setNewMember({ ...newMember, name: text })}
            mode="outlined"
            style={styles.modalInput}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Nom"
            value={newMember.surname}
            onChangeText={text => setNewMember({ ...newMember, surname: text })}
            mode="outlined"
            style={styles.modalInput}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            value={newMember.email}
            onChangeText={text => setNewMember({ ...newMember, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.modalInput}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label={
              editingMember
                ? 'Nouveau mot de passe (optionnel)'
                : 'Mot de passe'
            }
            value={newMember.password}
            onChangeText={text =>
              setNewMember({ ...newMember, password: text })
            }
            mode="outlined"
            secureTextEntry
            style={styles.modalInput}
            placeholder={
              editingMember ? 'Laisser vide pour ne pas modifier' : ''
            }
            left={<TextInput.Icon icon="lock" />}
          />

          {editingMember && (
            <Text style={styles.helperText}>
              💡 Laissez le mot de passe vide pour ne pas le modifier
            </Text>
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setEditingMember(null);
              }}
              style={styles.modalButton}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={editingMember ? handleEditMember : handleAddMember}
              style={styles.modalButton}
              buttonColor="#e63946"
              loading={saving}
              disabled={saving}
            >
              {editingMember ? 'Mettre à jour' : 'Créer'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChip: {
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2121',
  },
  emptyStateDesc: {
    fontSize: 13,
    color: '#626c6c',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#e63946',
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#626c6c',
    marginBottom: 16,
    marginTop: -8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  modalButton: {
    flex: 1,
  },
});
