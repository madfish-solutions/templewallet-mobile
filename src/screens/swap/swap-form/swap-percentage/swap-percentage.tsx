import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import { FormikState } from 'formik';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';

import { isAndroid } from '../../../../config/system';
import { SwapFormValues } from '../../../../interfaces/swap-asset.interface';
import { useTokensListSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
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
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={isKeyboardVisible ? (isAndroid ? formatSize(80) : formatSize(37.5)) : 0}
      behavior="padding"
      // eslint-disable-next-line react-native/no-inline-styles
      style={[swapPercentageStyles.keyboard, { height: isKeyboardVisible ? formatSize(44) : 0 }]}
    >
      {isKeyboardVisible && (
        <View style={swapPercentageStyles.container}>
          <View style={swapPercentageStyles.percentageGroup}>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.25));
                Keyboard.dismiss();
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.5));
                Keyboard.dismiss();
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', new BigNumber(token.balance).times(0.75));
                Keyboard.dismiss();
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue(
                  'inputAssets.amount',
                  BigNumber.maximum(new BigNumber(token.balance).minus(token.symbol === 'TEZ' ? 3 * 10 ** 5 : 0), 0)
                );
                Keyboard.dismiss();
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
