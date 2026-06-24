import { memo } from 'react';
import { Text, View } from 'react-native';

import { useNetworkSettingsLayoutStyles } from './styles';

interface OptionProps {
  id: string;
  title: string;
  description: string;
}

interface NetworkSettingsLayoutProps {
  activeRpcEndpointId: string;
  rpcEndpoints: OptionProps[];
  activeBlockExplorerId: string;
  blockExplorers: OptionProps[];
}

export const NetworkSettingsLayout = memo<NetworkSettingsLayoutProps>(
  ({ activeRpcEndpointId, rpcEndpoints, activeBlockExplorerId, blockExplorers }) => {
    const styles = useNetworkSettingsLayoutStyles();

    return (
      <View style={styles.container}>
        <LayoutSection title="RPC Endpoints" items={rpcEndpoints} activeItemId={activeRpcEndpointId} />
        <LayoutSection title="Block Explorers" items={blockExplorers} activeItemId={activeBlockExplorerId} />
      </View>
    );
  }
);

interface LayoutSectionProps {
  title: string;
  items: OptionProps[];
  activeItemId: string;
}

const LayoutSection = memo<LayoutSectionProps>(({ title, items, activeItemId }) => {
  const styles = useNetworkSettingsLayoutStyles();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map(({ id, title, description }) => (
        <View key={id} style={styles.optionContainer}>
          <View>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionDescription}>{description}</Text>
          </View>
          {id === activeItemId && (
            <View style={styles.activeLabel}>
              <Text style={styles.activeLabelText}>Active</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
});
