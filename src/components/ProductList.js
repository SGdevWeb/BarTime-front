import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { productService } from '../services/api/products';

const groupByCategory = arr => {
  const categories = {};
  arr.forEach(item => {
    // ⚠️ IMPORTANT : item.category est un objet {id, name} venant du backend
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();

      if (response.success) {
        setProducts(response.data); // ✅ Mettre à jour l'état
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

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucun produit disponible</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryText}>Réessayer</Text>
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    backgroundColor: 'white',
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
    backgroundColor: '#F0F0F0',
    color: '#457b9d',
    borderRadius: 8,
    elevation: 1,
  },
  name: { fontSize: 16, flex: 1 },
  price: { fontSize: 16, width: 50, textAlign: 'right' },
  buttons: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#457b9d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
  qty: { marginHorizontal: 10, fontSize: 16 },
});
