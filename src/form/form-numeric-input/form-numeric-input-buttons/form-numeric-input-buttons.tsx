import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonSmallSecondary } from '../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../components/divider/divider';
import { EventFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { FormNumericInputButtonsStyles } from './form-numeric-input-buttons.styles';

interface Props {
  maxValue: BigNumber;
  setValue: EventFn<BigNumber>;
}

export const FormNumericInputButtons: FC<Props> = ({ maxValue, setValue }) => {
  return (
    <>
      <View style={FormNumericInputButtonsStyles.container}>
        <ButtonSmallSecondary title="25%" onPress={() => setValue(maxValue.multipliedBy(0.25))} />
        <Divider size={formatSize(8)} />
        <ButtonSmallSecondary title="50%" onPress={() => setValue(maxValue.multipliedBy(0.5))} />
        <Divider size={formatSize(8)} />
        <ButtonSmallSecondary title="75%" onPress={() => setValue(maxValue.multipliedBy(0.75))} />
        <Divider size={formatSize(8)} />
        <ButtonSmallSecondary title="MAX" onPress={() => setValue(maxValue)} />
      </View>
      <Divider size={formatSize(8)} />
    </>
  );
};
