// src/components/Settings/SettingsHome.js
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { List, Divider, Avatar, Text } from 'react-native-paper';

export default function SettingsHome({ onNavigate, onLogout, user }) {
  console.log(user);

  // Rendu conditionnel de l'en-tête selon le type d'utilisateur
  const renderHeader = () => {
    if (user.role === 'association') {
      // En-tête pour les associations
      return (
        <View style={styles.userHeader}>
          <Avatar.Icon
            size={64}
            icon="domain"
            style={styles.avatarAssociation}
          />
          <Text style={styles.associationName}>
            {user.association_name || 'Mon Association'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.roleAssociation}>Compte Association</Text>
        </View>
      );
    }

    // En-tête pour les adhérents
    return (
      <View style={styles.userHeader}>
        <Avatar.Text
          size={64}
          label={`${user.name?.[0] || ''}${user.surname?.[0] || ''}`}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
          {user.name} {user.surname}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userRole}>
          {user.permissions?.includes('manage_bar')
            ? 'Adhérent • Barman'
            : 'Adhérent'}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête utilisateur ou association */}
      {renderHeader()}

      <Divider style={styles.sectionDivider} />

      {/* Section Association (uniquement pour les associations) */}
      {user.role === 'association' && (
        <>
          <List.Section>
            <List.Subheader>Association</List.Subheader>
            <List.Item
              title="Informations de l'association"
              description="Nom, adresse, contact"
              left={props => <List.Icon {...props} icon="domain" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => onNavigate('association', 'Mon Association')}
            />
            <Divider />
            <List.Item
              title="Gestion des adhérents"
              description="Ajouter, modifier, supprimer"
              left={props => <List.Icon {...props} icon="account-group" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => onNavigate('members', 'Adhérents')}
            />
            <Divider />
            <List.Item
              title="Gestion des barmans"
              description="Permissions et droits d'accès"
              left={props => <List.Icon {...props} icon="glass-mug-variant" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => onNavigate('barmans', 'Barmans')}
            />
          </List.Section>

          <Divider style={styles.sectionDivider} />

          {/* Section Gestion */}
          <List.Section>
            <List.Subheader>Gestion</List.Subheader>
            <List.Item
              title="Gestion des produits"
              description="Carte, prix, catégories"
              left={props => <List.Icon {...props} icon="beer-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => onNavigate('products', 'Produits')}
            />
            <Divider />
            <List.Item
              title="Configuration Stripe"
              description="Paiements et recharges"
              left={props => (
                <List.Icon {...props} icon="credit-card-outline" />
              )}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => onNavigate('stripe', 'Stripe')}
            />
          </List.Section>

          <Divider style={styles.sectionDivider} />
        </>
      )}

      {/* Section Compte (pour tous) */}
      <List.Section>
        <List.Subheader>Mon compte</List.Subheader>
        <List.Item
          title="Paramètres du compte"
          description="Email, mot de passe, solde"
          left={props => <List.Icon {...props} icon="account-cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => onNavigate('account', 'Mon compte')}
        />
      </List.Section>

      <Divider style={styles.sectionDivider} />

      {/* Section Informations */}
      <List.Section>
        <List.Subheader>Informations</List.Subheader>
        <List.Item
          title="À propos"
          description="Version, conditions, support"
          left={props => <List.Icon {...props} icon="information-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => onNavigate('about', 'À propos')}
        />
        <Divider />
        <List.Item
          title="Se déconnecter"
          description="Quitter l'application"
          left={props => <List.Icon {...props} icon="logout" color="#e63946" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={onLogout}
          titleStyle={{ color: '#e63946' }}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  avatar: {
    backgroundColor: '#e63946',
  },
  avatarAssociation: {
    backgroundColor: '#21808d',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    color: '#1f2121',
  },
  associationName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    color: '#1f2121',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#626c6c',
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#21808d',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(50, 184, 198, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleAssociation: {
    fontSize: 12,
    color: '#21808d',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(33, 128, 141, 0.15)',
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '500',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
});
