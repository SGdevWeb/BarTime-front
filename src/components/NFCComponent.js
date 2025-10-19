import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';

import PairBadge from './NFC/PairBadge';
import BadgeList from './NFC/BadgeList';
import SupplyBadge from './NFC/SupplyBadge';
import ReadBadge from './NFC/ReadBadge';

export default function NFCComponent() {
  // 💾 État centralisé pour tous les badges simulés
  const [badges, setBadges] = React.useState([
    {
      id: 'B001',
      user: 'Alice Dupont',
      balance: 12.5,
      history: [
        { date: '2025-10-10', montant: 10, type: 'Recharge espèces' },
        { date: '2025-10-12', montant: -2.5, type: 'Achat bière' },
      ],
    },
    {
      id: 'B002',
      user: 'Bob Martin',
      balance: 8.0,
      history: [{ date: '2025-10-15', montant: 8, type: 'Recharge espèces' }],
    },
  ]);

  // 📂 Gestion du panneau actuellement ouvert
  const [expanded, setExpanded] = React.useState('');

  const handlePress = section => {
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
        >
          <ReadBadge badges={badges} setBadges={setBadges} />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Appairer un badge"
          expanded={expanded === 'appairage'}
          onPress={() => handlePress('appairage')}
          left={props => <List.Icon {...props} icon="link-variant" />}
        >
          <PairBadge badges={badges} setBadges={setBadges} />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Liste des badges appairés"
          expanded={expanded === 'liste'}
          onPress={() => handlePress('liste')}
          left={props => <List.Icon {...props} icon="format-list-bulleted" />}
        >
          <BadgeList badges={badges} />
        </List.Accordion>

        <Divider />

        <List.Accordion
          title="Recharger un badge"
          expanded={expanded === 'rechargement'}
          onPress={() => handlePress('rechargement')}
          left={props => (
            <List.Icon {...props} icon="credit-card-plus-outline" />
          )}
        >
          <SupplyBadge badges={badges} setBadges={setBadges} />
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
