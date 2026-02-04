import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function About() {
  const openEmail = () => {
    Linking.openURL('mailto:contact@sgwebcreation.fr');
  };

  const openWebsite = () => {
    Linking.openURL('https://sgwebcreation.fr');
  };

  const openDocumentation = () => {
    Linking.openURL('https://sgwebcreation.fr');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec dégradé visuel */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🍺</Text>
        </View>
        <Text style={styles.title}>BarTime</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.subtitle}>
          Gestion simplifiée pour associations sportives, bars et clubs
        </Text>
      </View>

      <View style={styles.content}>
        {/* Card Développé par */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>💻</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Développé par</Text>
            <Text style={styles.cardText}>SGWebCreation</Text>
            <Text style={styles.cardSubtext}>
              Solutions web & mobile sur mesure
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={openWebsite}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Visiter le site 🔗</Text>
          </TouchableOpacity>
        </View>

        {/* Card Support */}
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.iconText}>🎧</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Support</Text>
            <Text style={styles.cardText}>Besoin d'aide ?</Text>
            <Text style={styles.cardSubtext}>
              Notre équipe est là pour vous
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={openEmail}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Nous contacter 📧</Text>
          </TouchableOpacity>
        </View>

        {/* Card Documentation */}
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.iconText}>📚</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Documentation</Text>
            <Text style={styles.cardText}>Guide complet</Text>
            <Text style={styles.cardSubtext}>
              Toutes les fonctionnalités expliquées
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={openDocumentation}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Consulter la doc 📖</Text>
          </TouchableOpacity>
        </View>

        {/* Card Créateur */}
        <View style={styles.card}>
          <View style={[styles.cardIcon, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.iconText}>👨‍💻</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Créateur</Text>
            <Text style={styles.cardText}>Sam</Text>
            <Text style={styles.cardSubtext}>Développeur Full Stack</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 SGWebCreation</Text>
          <Text style={styles.footerSubtext}>Tous droits réservés</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#457b9d',
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconText: {
    fontSize: 30,
  },
  cardContent: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#457b9d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
});
