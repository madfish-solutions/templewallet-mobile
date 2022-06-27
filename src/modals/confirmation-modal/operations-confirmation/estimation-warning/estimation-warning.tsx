import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { ButtonMedium } from '../../../../components/button/button-medium/button-medium';
import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { copyStringToClipboard } from '../../../../utils/clipboard.utils';
import { useEstimationWarningStyles } from './estimation-warning.styles';

export const EstimationWarning: FC<{ errorMessage: string }> = ({ errorMessage }) => {
  const styles = useEstimationWarningStyles();

  const handleCopyButtonPress = () => copyStringToClipboard(errorMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Warning! The transaction is likely to fail!</Text>
      <Divider />
      <ButtonMedium title="Copy error logs" iconName={IconNameEnum.Copy} onPress={handleCopyButtonPress} />
    </View>
  );
};
