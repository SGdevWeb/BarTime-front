// src/components/Settings/ProductManagement.js
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
  Chip,
  Divider,
  IconButton,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import { categoryService } from '../../services/api/categories';
import { productService } from '../../services/api/products';

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

export default function ProductManagement({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (err) {
      console.error('Erreur chargement données:', err);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();

      if (response.success) {
        const filteredProducts = response.data.filter(
          p => p.association_id === user.association_id,
        );
        setProducts(filteredProducts);
      }
    } catch (err) {
      console.error('Erreur chargement produits:', err);
      throw err;
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();

      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      throw err;
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category_id: '' });
    setModalVisible(true);
  };

  const openEditModal = product => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id.toString(),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Le nom du produit est requis');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Erreur', 'Le prix doit être supérieur à 0');
      return;
    }

    if (!formData.category_id) {
      Alert.alert('Erreur', 'La catégorie est requise');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
      };

      if (editingProduct) {
        const response = await productService.update(
          editingProduct.id,
          productData,
        );

        if (response.success) {
          Alert.alert('Succès', 'Produit mis à jour');
        }
      } else {
        const response = await productService.create(productData);

        if (response.success) {
          Alert.alert('Succès', 'Produit créé avec succès');
        }
      }

      setModalVisible(false);
      loadProducts();
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = product => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await productService.delete(product.id);

              if (response.success) {
                loadProducts();
                Alert.alert('Succès', 'Produit supprimé');
              }
            } catch (err) {
              console.error('Erreur suppression produit:', err);
              Alert.alert('Erreur', 'Impossible de supprimer le produit');
            }
          },
        },
      ],
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Erreur', 'Le nom de la catégorie est requis');
      return;
    }

    setSaving(true);
    try {
      const response = await categoryService.create({
        name: newCategoryName.trim(),
      });

      if (response.success) {
        Alert.alert('Succès', 'Catégorie créée avec succès');
        setCategoryModalVisible(false);
        setNewCategoryName('');

        // Recharger les catégories
        await loadCategories();

        // Pré-sélectionner la nouvelle catégorie
        setFormData({
          ...formData,
          category_id: response.data.id.toString(),
        });
      }
    } catch (err) {
      console.error('Erreur création catégorie:', err);
      Alert.alert('Erreur', err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const groupedProducts = categories.map(category => ({
    ...category,
    products: products.filter(p => p.category_id === category.id),
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  const getCategoryName = categoryId => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : 'Sélectionner une catégorie';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {groupedProducts.map(category => {
          if (category.products.length === 0) return null;

          return (
            <View key={category.id}>
              <List.Subheader>
                {category.name} ({category.products.length})
              </List.Subheader>
              {category.products.map(product => (
                <View key={product.id}>
                  <List.Item
                    title={product.name}
                    description={`Catégorie: ${category.name}`}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={getCategoryIcon(category.name)}
                        color={getCategoryColor(category.name)}
                      />
                    )}
                    right={() => (
                      <View style={styles.rightContent}>
                        <Chip mode="flat" style={styles.priceChip}>
                          {parseFloat(product.price).toFixed(2)} €
                        </Chip>
                        <IconButton
                          icon="pencil"
                          size={20}
                          onPress={() => openEditModal(product)}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          iconColor="#d32f2f"
                          onPress={() => handleDelete(product)}
                        />
                      </View>
                    )}
                    onPress={() => openEditModal(product)}
                  />
                  <Divider />
                </View>
              ))}
            </View>
          );
        })}

        {products.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Aucun produit enregistré</Text>
            <Text style={styles.emptyStateDesc}>
              Appuyez sur + pour ajouter votre premier produit
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB icon="plus" style={styles.fab} onPress={openAddModal} color="#fff" />

      <Portal>
        {/* Modal Produit */}
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setMenuVisible(false);
          }}
          contentContainerStyle={styles.modal}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalScrollView}
          >
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </Text>

            <TextInput
              label="Nom du produit"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.modalInput}
              left={<TextInput.Icon icon="food" />}
            />

            <TextInput
              label="Prix (€)"
              value={formData.price}
              onChangeText={text => setFormData({ ...formData, price: text })}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.modalInput}
              left={<TextInput.Icon icon="currency-eur" />}
              placeholder="2.50"
            />

            <Text style={styles.pickerLabel}>Catégorie *</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.categoryButton}
                  contentStyle={styles.categoryButtonContent}
                  icon={
                    formData.category_id
                      ? getCategoryIcon(getCategoryName(formData.category_id))
                      : 'chevron-down'
                  }
                >
                  {getCategoryName(formData.category_id)}
                </Button>
              }
              style={styles.menu}
            >
              {categories.map(category => (
                <Menu.Item
                  key={category.id}
                  onPress={() => {
                    setFormData({
                      ...formData,
                      category_id: category.id.toString(),
                    });
                    setMenuVisible(false);
                  }}
                  title={category.name}
                  leadingIcon={getCategoryIcon(category.name)}
                />
              ))}
              <Divider />

              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  setCategoryModalVisible(true);
                }}
                title="+ Nouvelle catégorie"
                leadingIcon="plus-circle-outline"
                titleStyle={{ color: '#e63946', fontWeight: '600' }}
              />
            </Menu>

            {!formData.category_id && (
              <Text style={styles.helperText}>
                Veuillez sélectionner une catégorie
              </Text>
            )}

            <View style={{ height: 80 }} />
          </ScrollView>

          <View style={styles.modalButtonsContainer}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setMenuVisible(false);
              }}
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
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
          </View>
        </Modal>

        <Modal
          visible={categoryModalVisible}
          onDismiss={() => {
            setCategoryModalVisible(false);
            setNewCategoryName('');
          }}
          contentContainerStyle={styles.categoryModal}
        >
          <Text style={styles.modalTitle}>Nouvelle catégorie</Text>

          <TextInput
            label="Nom de la catégorie"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            mode="outlined"
            style={styles.modalInput}
            left={<TextInput.Icon icon="tag" />}
            placeholder="Ex: Cocktails"
            autoFocus
          />

          <View style={styles.modalButtonsContainer}>
            <Button
              mode="outlined"
              onPress={() => {
                setCategoryModalVisible(false);
                setNewCategoryName('');
              }}
              style={styles.modalButton}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateCategory}
              style={styles.modalButton}
              buttonColor="#e63946"
              loading={saving}
              disabled={saving}
            >
              Créer
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
  priceChip: {
    backgroundColor: '#e8f5e9',
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
    margin: 20,
    borderRadius: 12,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalScrollView: {
    padding: 24,
    paddingBottom: 0,
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
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#626c6c',
    marginBottom: 8,
  },
  categoryButton: {
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  categoryButtonContent: {
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#e63946',
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    paddingTop: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 1,
  },
  categoryModal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
});
