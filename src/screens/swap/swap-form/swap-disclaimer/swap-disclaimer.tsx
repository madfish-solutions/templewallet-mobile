import React from 'react';
import { View, Text } from 'react-native';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';

import { useSwapDisclaimerStyles } from './swap-desclaimer.styles';

export const SwapDisclaimer = () => {
  const styles = useSwapDisclaimerStyles();

  return (
    <Disclaimer title="Disclaimer">
      <View>
        <Text style={styles.description}>
          Temple wallet provides an interface to interact with the
          <Divider size={formatSize(4)} />
          <Text style={styles.link} onPress={() => openUrl('https://3route.io/')}>
            3route DEX aggregator
          </Text>
        </Text>
      </View>
    </Disclaimer>
  );
};
