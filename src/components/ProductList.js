import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Leffe blonde', price: 3, category: 'Bières' },
  { id: '2', name: 'Bière de Noel', price: 3.5, category: 'Bières' },
  { id: '3', name: 'Jupiler', price: 3.5, category: 'Bières' },
  { id: '4', name: 'Jenlain ambré', price: 3.5, category: 'Bières' },
  { id: '5', name: 'Coca', price: 2, category: 'Sodas' },
  { id: '6', name: 'Orangina', price: 2, category: 'Sodas' },
  { id: '7', name: 'Oasis', price: 2, category: 'Sodas' },
  { id: '8', name: 'Eau', price: 2, category: 'Sodas' },
  { id: '9', name: 'Vin rouge', price: 4, category: 'Vins' },
  { id: '10', name: 'Vin blanc', price: 4, category: 'Vins' },
  { id: '11', name: 'Rosé', price: 4, category: 'Vins' },
  { id: '12', name: 'Pastis', price: 3, category: 'Apéritif' },
  { id: '13', name: 'Chips', price: 1.5, category: 'Autres' },
  { id: '14', name: 'Snikers', price: 1.5, category: 'Autres' },
];

const groupByCategory = arr => {
  const categories = {};
  arr.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });
  return Object.keys(categories).map(key => ({
    title: key,
    data: categories[key],
  }));
};

export default function ProductList({ cart, addToCart, removeFromCart }) {
  const renderItem = ({ item }) => {
    const qty = cart[item.id] || 0;
    return (
      <View style={styles.product}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}€</Text>
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
      sections={groupByCategory(PRODUCTS)}
      keyExtractor={item => item.id}
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
