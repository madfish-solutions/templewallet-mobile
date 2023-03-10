import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { openUrl } from 'src/utils/linking.util';

import { useSwapDisclaimerStyles } from './swap-desclaimer.styles';

export const SwapDisclaimer = () => {
  const styles = useSwapDisclaimerStyles();

  return (
    <Disclaimer title="Disclaimer" texts={[]}>
      <View>
        <Text>Temple wallet provides an interface to interact</Text>
        <View style={styles.container}>
          <Text>with the </Text>
          <TouchableOpacity onPress={() => openUrl('https://3route.io/')}>
            <Text style={styles.link}>3route DEX aggregator.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Disclaimer>
  );
};
