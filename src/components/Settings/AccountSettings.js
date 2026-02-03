import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import {
  List,
  Button,
  Card,
  Text,
  Divider,
  Chip,
  TextInput,
} from 'react-native-paper';

export default function AccountSettings({ user, onLogout, onUpdateProfile }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');

  const getRoleName = role => {
    const roles = {
      admin: 'Administrateur',
      barman: 'Barman',
      member: 'Membre',
      user: 'Utilisateur',
      association: 'Administrateur',
      adherent: 'Adhérent',
    };
    return roles[role] || role;
  };

  const contactSupport = subject => {
    const email = 'support@sgwebcreation.fr';
    const body = `Bonjour,\n\nJe souhaite ${subject}.\n\nMon compte actuel :\n- Email : ${user?.email}\n- Nom : ${user?.name} ${user?.surname}\n- Association ID : ${user?.association_id}\n\nMerci de votre aide.`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      'Demande de modification - BarTime',
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Contact Support',
        `Envoyez un email à ${email} avec votre demande de modification.`,
      );
    });
  };

  const handleSaveName = async () => {
    if (!name.trim() || !surname.trim()) {
      Alert.alert('Erreur', 'Le nom et le prénom sont obligatoires');
      return;
    }

    try {
      await onUpdateProfile({ name: name.trim(), surname: surname.trim() });
      setIsEditingName(false);
      Alert.alert('Succès', 'Vos informations ont été mises à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour vos informations');
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setSurname(user?.surname || '');
    setIsEditingName(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {!isEditingName ? (
            <>
              <List.Item
                title="Nom complet"
                description={
                  user?.name && user?.surname
                    ? `${user.name} ${user.surname}`
                    : user?.name || 'Non renseigné'
                }
                left={props => <List.Icon {...props} icon="account" />}
                right={props => (
                  <Button
                    mode="text"
                    icon="pencil"
                    onPress={() => setIsEditingName(true)}
                    compact
                    style={styles.editButton}
                  >
                    Modifier
                  </Button>
                )}
              />
            </>
          ) : (
            <View style={styles.editContainer}>
              <TextInput
                label="Prénom"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Nom"
                value={surname}
                onChangeText={setSurname}
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.editButtons}>
                <Button
                  mode="outlined"
                  onPress={handleCancelEdit}
                  style={styles.cancelButton}
                >
                  Annuler
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveName}
                  style={styles.saveButton}
                >
                  Enregistrer
                </Button>
              </View>
            </View>
          )}

          <Divider />

          <List.Item
            title="Email"
            description={user?.email || 'Non renseigné'}
            left={props => <List.Icon {...props} icon="email" />}
          />

          <View style={styles.helperContainer}>
            <Text style={styles.helperText}>
              💡 Pour modifier votre email, contactez notre support
            </Text>
            <Button
              mode="text"
              icon="email-outline"
              onPress={() => contactSupport('modifier mon adresse email')}
              style={styles.helperButton}
              labelStyle={styles.helperButtonLabel}
            >
              Contacter le support
            </Button>
          </View>

          <Divider />

          <List.Item
            title="Rôle"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={() => (
              <Chip
                mode="flat"
                style={[
                  styles.roleChip,
                  (user?.role === 'admin' || user?.role === 'association') &&
                    styles.adminChip,
                  user?.role === 'barman' && styles.barmanChip,
                ]}
              >
                {getRoleName(user?.role)}
              </Chip>
            )}
          />

          <Divider />

          <Button
            mode="outlined"
            icon="lock-reset"
            style={styles.passwordButton}
            onPress={() => alert('🔒 Fonctionnalité à venir')}
          >
            Modifier le mot de passe
          </Button>
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
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  editContainer: {
    padding: 8,
  },
  input: {
    marginBottom: 12,
  },
  editButton: {
    marginRight: -20,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {},
  helperContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  helperButton: {
    alignSelf: 'center',
  },
  helperButtonLabel: {
    fontSize: 13,
  },
  roleChip: {
    backgroundColor: '#e0e0e0',
  },
  adminChip: {
    backgroundColor: '#ffebee',
  },
  barmanChip: {
    backgroundColor: '#e3f2fd',
  },
  passwordButton: {
    marginTop: 16,
  },
});
