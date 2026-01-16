import React, { FC, useCallback, useMemo, useState } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useCheckboxIconStyles } from './checkbox-icon.styles';

interface Props {
  text: string;
  onActive: EmptyFn;
  onDisactive: EmptyFn;
  initialState?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const CheckboxIcon: FC<Props> = ({ text, onActive, onDisactive, initialState = false, textStyle, style }) => {
  const [isActive, setIsActive] = useState(initialState);

  const styles = useCheckboxIconStyles();

  const handleActive = () => {
    setIsActive(false);
    onActive();
  };

  const handleDisactive = () => {
    setIsActive(true);
    onDisactive();
  };

  const getContainer = useCallback(
    (name: IconNameEnum, onPress: EmptyFn) => (
      <TouchableOpacity onPress={onPress} style={[styles.root, style]}>
        <Icon name={name} size={formatSize(24)} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const icon = useMemo(
    () =>
      isActive
        ? getContainer(IconNameEnum.CheckboxOn, handleActive)
        : getContainer(IconNameEnum.CheckboxOff, handleDisactive),
    [isActive]
  );

  return icon;
};
