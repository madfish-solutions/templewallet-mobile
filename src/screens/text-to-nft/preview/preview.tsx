import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { usePreviewStyles } from './preview.styles';

export const PreviewScreen: FC = () => {
  const { formValues } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Preview>>().params;
  const styles = usePreviewStyles();

  return (
    <View style={styles.root}>
      <Text>Form values: {JSON.stringify(formValues, null, 2)}</Text>
    </View>
  );
};
