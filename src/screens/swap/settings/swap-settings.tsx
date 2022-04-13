import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { FormNumericInput } from '../../../form/form-numeric-input/form-numeric-input';
import { formatSize } from '../../../styles/format-size';
import { useSwapSettingsStyles } from './swap-settings.styles';

export const SwapSettingsScreen: FC = () => {
  const styles = useSwapSettingsStyles();
  const [inputTypeIndex, setInputTypeIndex] = useState(0);

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    setInputTypeIndex(tokenTypeIndex);
  };

  const onSubmit = () => {
    console.log('submit');
  };

  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      {({}) => (
        <View style={styles.contentWrapper}>
          <Label label="Slippage tolerance" />
          <TextSegmentControl
            selectedIndex={inputTypeIndex}
            values={['0.75%', '1.5%', '3.0%', 'Custom']}
            onChange={handleTokenInputTypeChange}
          />
          <Divider size={formatSize(10)} />
          {inputTypeIndex === 3 && <FormNumericInput name="id" decimals={0} />}
          <Text style={styles.desctiption}>
            Slippage tolerance is a setting for the limit of price slippage you are willing to accept.
          </Text>
        </View>
      )}
    </Formik>
  );
};
