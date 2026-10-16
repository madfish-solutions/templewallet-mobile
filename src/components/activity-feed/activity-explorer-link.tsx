import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useColors } from 'src/styles/use-colors';

import { useActivityExplorerLinkStyles } from './activity-explorer-link.styles';
import { ActivityFeedSelectors } from './selectors';
import { shortenHash } from './utils';

interface Props {
  chain: TempleChainKind;
  hash: string;
  url: string | undefined;
  onPress: EmptyFn;
}

export const ActivityExplorerLink = memo<Props>(({ chain, hash, url, onPress }) => {
  const styles = useActivityExplorerLinkStyles();
  const colors = useColors();

  const testIDProperties = useMemo(() => ({ chain }), [chain]);

  return (
    <View style={styles.container}>
      <TouchableWithAnalytics
        Component={TouchableOpacity}
        disabled={url == null}
        onPress={onPress}
        testID={ActivityFeedSelectors.operationHash}
        testIDProperties={testIDProperties}
      >
        <Text style={styles.hashText}>{shortenHash(hash)}</Text>
      </TouchableWithAnalytics>

      <TouchableWithAnalytics
        Component={TouchableOpacity}
        style={styles.iconContainer}
        disabled={url == null}
        onPress={onPress}
        testID={ActivityFeedSelectors.externalLink}
        testIDProperties={testIDProperties}
      >
        <IconV2 name={IconNameV2Enum.OutLink} size={12} color={colors.blue} />
      </TouchableWithAnalytics>
    </View>
  );
});
