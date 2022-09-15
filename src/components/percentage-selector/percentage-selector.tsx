import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
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

  const verticalOffset = useMemo(
    () => (isKeyboardVisible ? (isAndroid ? formatSize(80) : formatSize(37.5)) : 0),
    [isKeyboardVisible]
  );
  const keyboardShownStyle = useMemo(() => isKeyboardVisible && { height: formatSize(44) }, [isKeyboardVisible]);

  const handlePercentage = useCallback(
    (percentage: number) => {
      const newValue = new BigNumber(balance).times(percentage);
      handleChange(newValue);
      Keyboard.dismiss();
    },
    [handleChange, balance]
  );

  const handleMax = useCallback(() => {
    const newValue = BigNumber.maximum(new BigNumber(balance).minus(symbol === 'TEZ' ? 300000 : 0), 0);
    handleChange(newValue);
    Keyboard.dismiss();
  }, [handleChange, balance, symbol]);

  const handleDismiss = useCallback(() => void Keyboard.dismiss(), []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={verticalOffset}
      behavior="padding"
      style={[percentageStyles.keyboard, keyboardShownStyle]}
    >
      {isKeyboardVisible && (
        <View style={percentageStyles.container}>
          <View style={percentageStyles.percentageGroup}>
            <TouchableOpacity onPress={() => handlePercentage(0.25)} style={percentageStyles.percentageShape}>
              <Text style={percentageStyles.percentageText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePercentage(0.5)} style={percentageStyles.percentageShape}>
              <Text style={percentageStyles.percentageText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePercentage(0.75)} style={percentageStyles.percentageShape}>
              <Text style={percentageStyles.percentageText}>75%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMax} style={percentageStyles.percentageShape}>
              <Text style={percentageStyles.percentageText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleDismiss}>
            <Text style={percentageStyles.percentageText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
