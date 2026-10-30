import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { DisclaimerV2 } from 'src/components/disclaimer/disclaimer';
import { openUrl } from 'src/utils/linking';

import { useInterfaceDisclaimerStyles } from './interface-disclaimer.styles';

interface Props {
  linkText: string;
  url: string;
}

const DESCRIPTION_WORDS = 'Temple wallet provides an interface to interact with the'.split(' ');

export const InterfaceDisclaimer = ({ linkText, url }: Props) => {
  const styles = useInterfaceDisclaimerStyles();

  return (
    <DisclaimerV2 title="Disclaimer">
      <View style={styles.text}>
        {DESCRIPTION_WORDS.map(word => (
          <Text key={word} style={styles.description}>{`${word} `}</Text>
        ))}
        <TouchableOpacity style={styles.link} onPress={() => openUrl(url)}>
          <Text style={styles.linkText}>{linkText}</Text>
        </TouchableOpacity>
      </View>
    </DisclaimerV2>
  );
};
