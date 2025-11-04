// src/components/Settings/BarmanManagement.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import {
  List,
  Searchbar,
  Switch,
  Text,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { apiClient } from '../../services/api/client';

export default function BarmanManagement({ user }) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      // Charger tous les adhérents de l'association
      const response = await apiClient(
        `/users?association_id=${user.association_id}&role=adherent`,
      );

      if (response.success) {
        // Parser les permissions qui sont en JSON string
        const membersWithParsedPermissions = response.data.map(member => ({
          ...member,
          permissions: member.permissions
            ? typeof member.permissions === 'string'
              ? JSON.parse(member.permissions)
              : member.permissions
            : [],
        }));
        setMembers(membersWithParsedPermissions);
      }
    } catch (err) {
      console.error('Erreur chargement adhérents:', err);
      Alert.alert('Erreur', 'Impossible de charger les adhérents');
    } finally {
      setLoading(false);
    }
  };

  const toggleBarmanPermission = async (memberId, currentPermissions) => {
    setUpdating(true);
    try {
      const hasPermission = currentPermissions.includes('manage_bar');
      const newPermissions = hasPermission
        ? currentPermissions.filter(p => p !== 'manage_bar')
        : [...currentPermissions, 'manage_bar'];

      console.log('Update permissions:', { memberId, newPermissions });

      // Appel API pour mettre à jour les permissions
      const response = await apiClient(`/users/${memberId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({
          userId: memberId,
          permissions: newPermissions,
        }),
      });

      if (response.success) {
        // Mettre à jour localement
        setMembers(
          members.map(m =>
            m.id === memberId ? { ...m, permissions: newPermissions } : m,
          ),
        );

        Alert.alert(
          'Succès',
          hasPermission
            ? 'Permission barman retirée'
            : 'Permission barman accordée',
        );
      }
    } catch (err) {
      console.error('Erreur mise à jour permissions:', err);
      Alert.alert('Erreur', 'Erreur lors de la mise à jour des permissions');
    } finally {
      setUpdating(false);
    }
  };

  const filteredMembers = members.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const barmans = filteredMembers.filter(m =>
    m.permissions.includes('manage_bar'),
  );
  const others = filteredMembers.filter(
    m => !m.permissions.includes('manage_bar'),
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
        {/* Section Barmans actifs */}
        {barmans.length > 0 && (
          <>
            <List.Subheader>Barmans actifs ({barmans.length})</List.Subheader>
            {barmans.map(member => (
              <View key={member.id}>
                <List.Item
                  title={`${member.name} ${member.surname}`}
                  description={member.email}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon="glass-mug-variant"
                      color="#e63946"
                    />
                  )}
                  right={() => (
                    <View style={styles.rightContent}>
                      <Switch
                        value={member.permissions.includes('manage_bar')}
                        onValueChange={() =>
                          toggleBarmanPermission(member.id, member.permissions)
                        }
                        disabled={updating}
                        color="#e63946"
                      />
                    </View>
                  )}
                />
                <Divider />
              </View>
            ))}
          </>
        )}

        {/* Section Autres adhérents */}
        {others.length > 0 && (
          <>
            <List.Subheader style={{ marginTop: 16 }}>
              Autres adhérents ({others.length})
            </List.Subheader>
            {others.map(member => (
              <View key={member.id}>
                <List.Item
                  title={`${member.name} ${member.surname}`}
                  description={member.email}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon="account-circle"
                      color="#626c6c"
                    />
                  )}
                  right={() => (
                    <View style={styles.rightContent}>
                      <Switch
                        value={member.permissions.includes('manage_bar')}
                        onValueChange={() =>
                          toggleBarmanPermission(member.id, member.permissions)
                        }
                        disabled={updating}
                        color="#e63946"
                      />
                    </View>
                  )}
                />
                <Divider />
              </View>
            ))}
          </>
        )}

        {filteredMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Aucun adhérent trouvé</Text>
            {searchQuery ? (
              <Text style={styles.emptyStateDesc}>
                Essayez avec d'autres termes de recherche
              </Text>
            ) : (
              <Text style={styles.emptyStateDesc}>
                Aucun adhérent n'est enregistré dans votre association
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Info en bas */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Les barmans peuvent gérer le bar, scanner les badges et effectuer
          des transactions.
        </Text>
      </View>
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
    justifyContent: 'center',
    paddingRight: 8,
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
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoText: {
    fontSize: 13,
    color: '#1565c0',
  },
});
