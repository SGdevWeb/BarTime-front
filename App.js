import React, { useState } from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { View, Button, StyleSheet } from 'react-native';
import BarmanScreen from './src/screens/BarmanScreen';
import UserScreen from './src/screens/UserScreen';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [isBarman, setIsBarman] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent isBarman={isBarman} setIsBarman={setIsBarman} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent({ isBarman, setIsBarman }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Button
        title={isBarman ? 'Passer à User' : 'Passer à Barman'}
        onPress={() => setIsBarman(!isBarman)}
      />
      {isBarman ? <BarmanScreen /> : <UserScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
});
