import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, List, Divider, Chip } from 'react-native-paper';

export default function BadgeList({ badges = [] }) {
  if (badges.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Aucun badge appairé pour le moment 🪪
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {badges.map(badge => (
        <Card key={badge.id} style={styles.card} mode="elevated">
          <Card.Title
            title={badge.user}
            subtitle={`ID du badge : ${badge.id}`}
            left={props => <List.Icon {...props} icon="account-badge" />}
          />
          <Card.Content>
            <View style={styles.row}>
              <Text style={styles.label}>Solde actuel :</Text>
              <Chip style={styles.chip} textStyle={styles.chipText}>
                {badge.balance.toFixed(2)} €
              </Chip>
            </View>

            <List.Section>
              <List.Subheader>🧾 Historique</List.Subheader>

              {badge.history && badge.history.length > 0 ? (
                badge.history.map((item, i) => (
                  <React.Fragment key={i}>
                    <List.Item
                      title={item.type}
                      description={`Le ${item.date}`}
                      right={() => (
                        <Text
                          style={[
                            styles.montant,
                            { color: item.montant > 0 ? '#2a9d8f' : '#e63946' },
                          ]}
                        >
                          {item.montant > 0 ? '+' : ''}
                          {item.montant.toFixed(2)} €
                        </Text>
                      )}
                    />
                    {i < badge.history.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Text style={styles.noHistory}>Aucune transaction</Text>
              )}
            </List.Section>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16, // <-- espacement entre cartes
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  chip: {
    backgroundColor: '#1d3557',
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  montant: {
    fontWeight: '600',
    fontSize: 15,
    marginRight: 8,
  },
  noHistory: {
    fontStyle: 'italic',
    color: '#999',
    marginLeft: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
