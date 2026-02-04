import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import { badgeService } from '../services/api/badges';

import PairBadge from './NFC/PairBadge';
import BadgeList from './NFC/BadgeList';
import SupplyBadge from './NFC/SupplyBadge';
import ReadBadge from './NFC/ReadBadge';

// Pour Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NFCComponent() {
  const [badges, setBadges] = React.useState([]);
  const [expanded, setExpanded] = React.useState('');

  React.useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const response = await badgeService.getAll();

      if (response.success) {
        const mappedBadges = response.data.map(badge => ({
          id: badge.id,
          user:
            `${badge.name || ''} ${badge.surname || ''}`.trim() || badge.email,
          balance: parseFloat(badge.balance) || 0,
          email: badge.email,
          user_id: badge.user_id,
          is_active: badge.is_active,
          created_at: badge.created_at,
          history: badge.history || [],
        }));

        setBadges(mappedBadges);
      }
    } catch (err) {
      console.error('Erreur chargement badges:', err);
    }
  };

  const handlePress = section => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );

    setExpanded(expanded === section ? '' : section);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      showsVerticalScrollIndicator
    >
      <List.Section>
        <List.Accordion
          title="Lecture d’un badge"
          expanded={expanded === 'lecture'}
          onPress={() => handlePress('lecture')}
          left={props => <List.Icon {...props} icon="nfc" />}
          theme={{ colors: { primary: '#457b9d' } }}
          style={
            expanded === 'lecture' ? styles.accordionExpanded : styles.accordion
          }
        >
          <ReadBadge
            badges={badges}
            setBadges={setBadges}
            onRefresh={loadBadges}
          />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Appairer un badge"
          expanded={expanded === 'appairage'}
          onPress={() => handlePress('appairage')}
          left={props => <List.Icon {...props} icon="link-variant" />}
          theme={{ colors: { primary: '#457b9d' } }}
          style={
            expanded === 'lecture' ? styles.accordionExpanded : styles.accordion
          }
        >
          <PairBadge
            badges={badges}
            setBadges={setBadges}
            onRefresh={loadBadges}
          />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Liste des badges"
          expanded={expanded === 'liste'}
          onPress={() => handlePress('liste')}
          left={props => <List.Icon {...props} icon="format-list-bulleted" />}
          theme={{ colors: { primary: '#457b9d' } }}
          style={
            expanded === 'lecture' ? styles.accordionExpanded : styles.accordion
          }
        >
          <BadgeList badges={badges} onRefresh={loadBadges} />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Recharger un badge"
          expanded={expanded === 'rechargement'}
          onPress={() => handlePress('rechargement')}
          left={props => (
            <List.Icon {...props} icon="credit-card-plus-outline" />
          )}
          theme={{ colors: { primary: '#457b9d' } }}
          style={
            expanded === 'lecture' ? styles.accordionExpanded : styles.accordion
          }
        >
          <SupplyBadge
            badges={badges}
            setBadges={setBadges}
            onRefresh={loadBadges}
          />
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
