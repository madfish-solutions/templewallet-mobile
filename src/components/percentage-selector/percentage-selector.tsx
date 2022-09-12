import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import React, { FC, useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Text, View } from 'react-native';

import { isAndroid } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { usePercentageSelectorStyles } from './percentage-selector.styles';

interface Props {
  balance: string;
  symbol: string;
  handleChange: (newValue: BigNumber) => void;
}

export const PercentageSelector: FC<Props> = ({ symbol, balance, handleChange }) => {
  const percentageStyles = usePercentageSelectorStyles();

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
      style={[percentageStyles.keyboard, { height: isKeyboardVisible ? formatSize(44) : 0 }]}
    >
      {isKeyboardVisible && (
        <View style={percentageStyles.container}>
          <View style={percentageStyles.percentageGroup}>
            <TouchableOpacity
              onPress={() => {
                const newValue = new BigNumber(balance).times(0.25);
                handleChange(newValue);
                Keyboard.dismiss();
              }}
              style={percentageStyles.percentageShape}
            >
              <Text style={percentageStyles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newValue = new BigNumber(balance).times(0.5);
                handleChange(newValue);
                Keyboard.dismiss();
              }}
              style={percentageStyles.percentageShape}
            >
              <Text style={percentageStyles.percentageText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newValue = new BigNumber(balance).times(0.75);
                handleChange(newValue);
                Keyboard.dismiss();
              }}
              style={percentageStyles.percentageShape}
            >
              <Text style={percentageStyles.percentageText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newValue = BigNumber.maximum(new BigNumber(balance).minus(symbol === 'TEZ' ? 300000 : 0), 0);
                handleChange(newValue);
                Keyboard.dismiss();
              }}
              style={percentageStyles.percentageShape}
            >
              <Text style={percentageStyles.percentageText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <Text style={percentageStyles.percentageText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
