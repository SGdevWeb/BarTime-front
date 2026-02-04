// src/screens/BarmanLayout.js
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Appbar,
  BottomNavigation,
  IconButton,
  Tooltip,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from 'react-native-paper';

import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import NFCComponent from '../components/NFCComponent';
import SettingsStack from '../components/SettingsStack';

export default function BarmanLayout({
  onLogout,
  user,
  onSwitchMode,
  canSwitch,
}) {
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
    { key: 'cart', title: 'Commande', focusedIcon: 'clipboard-text-outline' },
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
            addToCart={addToCart}
            clearCart={clearCart}
            user={user}
          />
        );
      case 'settings':
        return <SettingsStack onLogout={onLogout} user={user} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (routes[index].key) {
      case 'productList':
        return 'Carte';
      case 'cart':
        return 'Commande';
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
      {/* Header avec switch discret */}
      <Appbar.Header>
        <Appbar.Content title={getTitle()} />

        {/* Switch Mode - Seulement pour adhérent-barman */}
        {canSwitch && (
          <IconButton
            icon="account"
            size={24}
            iconColor="#e63946"
            onPress={onSwitchMode}
            style={styles.switchIcon}
          />
        )}
      </Appbar.Header>

      {/* Navigation principale */}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false}
        compact={true}
        renderIcon={({ route, focused, color }) => {
          if (route.key === 'cart') {
            return (
              <View style={{ position: 'relative' }}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
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

          return (
            <MaterialCommunityIcons
              name={route.focusedIcon}
              size={24}
              color={color}
            />
          );
        }}
        activeColor="#457b9d"
        inactiveColor="#999"
        theme={{
          colors: {
            secondaryContainer: 'transparent',
          },
        }}
        barStyle={{
          backgroundColor: '#f6f6f6',
          height: 70,
          marginBottom: 5,
          paddingHorizontal: 15,
          borderTopColor: '#457b9d',
          borderTopWidth: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  content: { flex: 1 },
  switchIcon: {
    margin: 0,
  },
});
