import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { BlockExplorer, RpcBase } from 'src/types/networks';

import { useNetworkSettingsLayoutStyles } from './styles';

interface OptionProps {
  id: string;
  title: string;
  description: string;
}

interface NetworkSettingsLayoutProps {
  activeRpcEndpointId: string;
  rpcEndpoints: RpcBase[];
  activeBlockExplorerId: string;
  blockExplorers: BlockExplorer[];
}

export const NetworkSettingsLayout = memo<NetworkSettingsLayoutProps>(
  ({ activeRpcEndpointId, rpcEndpoints, activeBlockExplorerId, blockExplorers }) => {
    const styles = useNetworkSettingsLayoutStyles();

    const rpcEndpointItems = useMemo(
      () =>
        rpcEndpoints.map(({ id, name, description, rpcBaseURL }) => ({
          id,
          title: name,
          description: description || rpcBaseURL
        })),
      [rpcEndpoints]
    );

    const blockExplorerItems = useMemo(
      () => blockExplorers.map(({ id, name, url }) => ({ id, title: name, description: url })),
      [blockExplorers]
    );

    return (
      <View style={styles.container}>
        <LayoutSection title="RPC Endpoints" items={rpcEndpointItems} activeItemId={activeRpcEndpointId} />
        <LayoutSection title="Block Explorers" items={blockExplorerItems} activeItemId={activeBlockExplorerId} />
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
