import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { productService } from '../services/api/products';
import { ActivityIndicator, Button } from 'react-native-paper';

const groupByCategory = arr => {
  const categories = {};
  arr.forEach(item => {
    const categoryName = item.category?.name || 'Autres';
    if (!categories[categoryName]) categories[categoryName] = [];
    categories[categoryName].push(item);
  });
  return Object.keys(categories).map(key => ({
    title: key,
    data: categories[key],
  }));
};

export default function ProductList({ cart, addToCart, removeFromCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();

      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error('Erreur lors du chargement');
      }
    } catch (err) {
      console.error('Erreur:', err);
      Alert.alert('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#457b9d" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Aucun produit</Text>
        <Text style={styles.emptyText}>
          Commencez par ajouter vos premiers produits pour gérer votre buvette
        </Text>
        <Button
          mode="contained"
          onPress={() =>
            Alert.alert(
              'Bientôt disponible',
              'La gestion des produits arrive prochainement !',
            )
          }
          style={styles.emptyButton}
          icon="plus"
        >
          Ajouter des produits
        </Button>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryText}>🔄 Actualiser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const qty = cart[item.id] || 0;
    return (
      <View style={styles.product}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{parseFloat(item.price).toFixed(2)}€</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{qty}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => addToCart(item.id)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SectionList
      sections={groupByCategory(products)}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  emptyButton: {
    backgroundColor: '#457b9d',
    borderRadius: 12,
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#457b9d',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    backgroundColor: '#f7f7f7',
    paddingTop: 15,
    paddingBottom: 5,
    borderBottomColor: '#457b9d',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f7f7f7',
    color: '#457b9d',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    flex: 1,
    color: '#1d3557',
  },
  price: {
    fontSize: 16,
    width: 50,
    textAlign: 'right',
    color: '#1d3557',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#457b9d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qty: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1d3557',
    minWidth: 24,
    textAlign: 'center',
  },
});
