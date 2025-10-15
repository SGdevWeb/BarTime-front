import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from 'react-native-paper';

import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import NFCComponent from '../components/NFCComponent';
import SettingsStack from '../components/SettingsStack'; // contient Settings + sous-écrans

export default function BarmanLayout({ onLogout }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  const [cart, setCart] = React.useState({});

  const addToCart = id => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = id => {
    setCart(prev => {
      if (!prev[id]) return prev;
      const newQty = prev[id] - 1;
      const updated = { ...prev, [id]: newQty };
      if (newQty <= 0) delete updated[id];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const routes = [
    {
      key: 'productList',
      title: 'Carte',
      focusedIcon: 'beer-outline',
    },
    { key: 'cart', title: 'Panier', focusedIcon: 'cart-outline' },
    { key: 'nfc', title: 'Badge', focusedIcon: 'wifi' },
    { key: 'settings', title: 'Paramètres', focusedIcon: 'cog-outline' },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'productList':
        return (
          <ProductList
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        );
      case 'nfc':
        return <NFCComponent />;
      case 'cart':
        return (
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        );
      case 'settings':
        return <SettingsStack onLogout={onLogout} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (routes[index].key) {
      case 'productList':
        return 'Carte';
      case 'cart':
        return 'Panier';
      case 'nfc':
        return 'Badge';
      case 'settings':
        return 'Paramètres';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.Content title={getTitle()} />
      </Appbar.Header>

      {/* Navigation principale */}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={({ route, focused, color }) => {
          if (route.key === 'cart') {
            return (
              <View style={{ position: 'relative' }}>
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={24}
                  color={color}
                />
                {cartCount > 0 && (
                  <Badge
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -10,
                      backgroundColor: '#457b9d',
                      color: 'white',
                    }}
                    size={16}
                  >
                    {cartCount}
                  </Badge>
                )}
              </View>
            );
          }

          // Icônes normales pour les autres onglets
          return (
            <MaterialCommunityIcons
              name={route.focusedIcon}
              size={24}
              color={color}
            />
          );
        }}
        activeColor="#e63946"
        inactiveColor="#555"
        barStyle={{ backgroundColor: '#fff', height: 70 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});
