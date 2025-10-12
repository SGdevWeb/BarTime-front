import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import NFC from '../components/NFC';
import Settings from '../components/Settings';

const Tab = createBottomTabNavigator();

export default function BarmanScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Carte"
          component={ProductList}
          options={{ tabBarIcon: () => <Text>📋</Text> }}
        />
        <Tab.Screen
          name="Badge"
          component={NFC}
          options={{ tabBarIcon: () => <Text>📶</Text> }}
        />
        <Tab.Screen
          name="Panier"
          component={Cart}
          options={{ tabBarIcon: () => <Text>🛍️</Text> }}
        />
        <Tab.Screen
          name="Paramètres"
          component={Settings}
          options={{ tabBarIcon: () => <Text>⚙️</Text> }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabLabel: {
    fontSize: 12,
  },
});
