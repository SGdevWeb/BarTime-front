import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import NFCComponent from '../components/NFCComponent';
import SettingsStack from '../components/SettingsStack'; // contient Settings + sous-écrans

export default function BarmanLayout({ onLogout }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'productList',
      title: 'Carte',
      focusedIcon: 'clipboard-list-outline',
    },
    { key: 'nfc', title: 'Badge', focusedIcon: 'nfc' },
    { key: 'cart', title: 'Panier', focusedIcon: 'cart-outline' },
    { key: 'settings', title: 'Paramètres', focusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    productList: ProductList,
    nfc: NFCComponent,
    cart: Cart,
    settings: () => <SettingsStack onLogout={onLogout} />,
  });

  const getTitle = () => {
    switch (routes[index].key) {
      case 'productList':
        return 'Carte';
      case 'nfc':
        return 'Badge';
      case 'cart':
        return 'Panier';
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
        activeColor="#e63946"
        inactiveColor="#555"
        barStyle={{ backgroundColor: '#fff', height: 70 }}
        safeAreaInsets={{ bottom: insets.bottom }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
