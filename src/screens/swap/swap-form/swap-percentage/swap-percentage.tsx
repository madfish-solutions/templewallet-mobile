import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import { FormikState } from 'formik';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';

import { isAndroid } from '../../../../config/system';
import { SwapFormValues } from '../../../../interfaces/swap-asset.interface';
import { useTokensListSelector } from '../../../../store/wallet/wallet-selectors';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { useSwapPercentageStyles } from './swap-percentage.styles';

interface Props {
  formik: FormikState<SwapFormValues> & {
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  };
}

export const SwapPercentage: FC<Props> = ({ formik }) => {
  const swapPercentageStyles = useSwapPercentageStyles();

  const { values, setFieldValue } = formik;
  const { inputAssets } = values;
  const tokensList = useTokensListSelector();
  const token = useMemo(
    () =>
      tokensList.find(candidateToken => getTokenSlug(candidateToken) === getTokenSlug(inputAssets.asset)) ??
      inputAssets.asset,
    [tokensList, inputAssets.asset]
  );

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={isAndroid ? 60 : 50}
      behavior="padding"
      style={swapPercentageStyles.keyboard}
    >
      {isKeyboardVisible && (
        <View style={swapPercentageStyles.container}>
          <View style={swapPercentageStyles.percentageGroup}>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.25));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.5));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.75));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue(
                  'inputAssets.amount',
                  BigNumber.minimum(new BigNumber(token.balance).times(1).minus(token.symbol === 'TEZ' ? 0.3 : 0), 0)
                );
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Text style={swapPercentageStyles.percentageText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
