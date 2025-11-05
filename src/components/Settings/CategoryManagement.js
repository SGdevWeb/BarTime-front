// src/components/Settings/CategoryManagement.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import {
  List,
  FAB,
  Text,
  Portal,
  Modal,
  TextInput,
  Button,
  Divider,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { categoryService } from '../../services/api/categories';

const getCategoryIcon = categoryName => {
  const icons = {
    Bières: 'beer',
    Vins: 'glass-wine',
    'Vins effervescents': 'glass-flute',
    Apéritifs: 'glass-cocktail',
    Spiritueux: 'bottle-wine',
    Liqueurs: 'glass-cocktail',
    Sodas: 'cup-water',
    Eaux: 'water',
    'Jus & Sirops': 'cup',
    'Boissons chaudes': 'coffee',
    Snacks: 'popcorn',
    Autres: 'package-variant',
  };
  return icons[categoryName] || 'food';
};

const getCategoryColor = categoryName => {
  const colors = {
    Bières: '#FFA726',
    Vins: '#AB47BC',
    'Vins effervescents': '#E91E63',
    Apéritifs: '#EC407A',
    Spiritueux: '#8D6E63',
    Liqueurs: '#D32F2F',
    Sodas: '#42A5F5',
    Eaux: '#00BCD4',
    'Jus & Sirops': '#66BB6A',
    'Boissons chaudes': '#795548',
    Snacks: '#FF6F00',
    Autres: '#78909C',
  };
  return colors[categoryName] || '#e63946';
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();

      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      Alert.alert('Erreur', 'Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setModalVisible(true);
  };

  const openEditModal = category => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Erreur', 'Le nom de la catégorie est requis');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        // Mise à jour
        const response = await categoryService.update(editingCategory.id, {
          name: categoryName.trim(),
        });

        if (response.success) {
          Alert.alert('Succès', 'Catégorie mise à jour');
        }
      } else {
        // Création
        const response = await categoryService.create({
          name: categoryName.trim(),
        });

        if (response.success) {
          Alert.alert('Succès', 'Catégorie créée avec succès');
        }
      }

      setModalVisible(false);
      loadCategories();
    } catch (err) {
      console.error('Erreur sauvegarde catégorie:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async category => {
    try {
      const usageResponse = await categoryService.checkUsage(category.id);

      if (!usageResponse.success) {
        Alert.alert(
          'Erreur',
          "Impossible de vérifier l'utilisation de la catégorie",
        );
        return;
      }

      const { productCount, canDelete } = usageResponse.data;

      // Si la catégorie est utilisée, afficher un message d'erreur
      if (!canDelete) {
        Alert.alert(
          'Suppression impossible',
          `Cette catégorie ne peut pas être supprimée car ${productCount} produit${
            productCount > 1 ? 's' : ''
          } l'utilise${
            productCount > 1 ? 'nt' : ''
          }.\n\nVous devez d'abord supprimer ou recatégoriser ${
            productCount > 1 ? 'ces produits' : 'ce produit'
          }.`, // 👈 Corrigé
          [{ text: 'OK' }],
        );
        return;
      }

      // Si la catégorie n'est pas utilisée, demander confirmation
      Alert.alert(
        'Confirmer la suppression',
        `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await categoryService.delete(category.id);

                if (response.success) {
                  loadCategories();
                  Alert.alert('Succès', 'Catégorie supprimée');
                }
              } catch (err) {
                console.error('Erreur suppression catégorie:', err);
                Alert.alert(
                  'Erreur',
                  err.message || 'Impossible de supprimer la catégorie',
                );
              }
            },
          },
        ],
      );
    } catch (err) {
      console.error('Erreur vérification catégorie:', err);
      Alert.alert(
        'Erreur',
        "Impossible de vérifier l'utilisation de la catégorie",
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Chargement des catégories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {categories.map(category => (
          <View key={category.id}>
            <List.Item
              title={category.name}
              left={props => (
                <List.Icon
                  {...props}
                  icon={getCategoryIcon(category.name)}
                  color={getCategoryColor(category.name)}
                />
              )}
              right={() => (
                <View style={styles.rightContent}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => openEditModal(category)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor="#d32f2f"
                    onPress={() => handleDelete(category)}
                  />
                </View>
              )}
              onPress={() => openEditModal(category)}
            />
            <Divider />
          </View>
        ))}

        {categories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Aucune catégorie enregistrée
            </Text>
            <Text style={styles.emptyStateDesc}>
              Appuyez sur + pour ajouter votre première catégorie
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={openAddModal} color="#fff" />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </Text>

          <TextInput
            label="Nom de la catégorie"
            value={categoryName}
            onChangeText={setCategoryName}
            mode="outlined"
            style={styles.modalInput}
            left={<TextInput.Icon icon="tag" />}
            placeholder="Ex: Cocktails"
            autoFocus
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.modalButton}
              buttonColor="#e63946"
              loading={saving}
              disabled={saving}
            >
              {editingCategory ? 'Mettre à jour' : 'Créer'}
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
  list: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1f2121',
  },
  modalInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});
