import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

import { useExolixStyles } from '../exolix.styles';

interface CopyRowProps {
  data?: string | null;
  title: string;
}

export const CopyRow: FC<CopyRowProps> = ({ title = 'Transaction ID:', data }) => {
  const styles = useExolixStyles();

  const handleCopyDataPress = () => isDefined(data) && copyStringToClipboard(data);

  if (!isDefined(data)) {
    return null;
  }

  return (
    <>
      <View style={styles.footerContainer}>
        <Text style={styles.infoText}>{title}</Text>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyDataPress}>
            <Text style={styles.publicKeyHash}>{truncateLongAddress(data)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Divider size={formatSize(8)} />
    </>
  );
};
