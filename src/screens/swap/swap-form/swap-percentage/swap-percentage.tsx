import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { FormikState } from 'formik';
import React, { FC, useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';

import { isAndroid } from '../../../../config/system';
import { SwapFormValues } from '../../../../interfaces/swap-asset.interface';
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

  // if (!isKeyboardVisible) {
  //   return <KeyboardAvoidingView behavior="padding" />;
  // }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={isAndroid ? 120 : 50}
      behavior="padding"
      style={swapPercentageStyles.keyboard}
    >
      {isKeyboardVisible && (
        <View style={swapPercentageStyles.container}>
          <View style={swapPercentageStyles.percentageGroup}>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', inputAssets?.amount?.times(0.25));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', inputAssets?.amount?.times(0.25));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', inputAssets?.amount?.times(0.25));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFieldValue('inputAssets.amount', inputAssets?.amount?.times(0.25));
              }}
              style={swapPercentageStyles.percentageShape}
            >
              <Text style={swapPercentageStyles.percentageText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={swapPercentageStyles.percentageText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
