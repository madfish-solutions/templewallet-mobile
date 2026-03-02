import React from 'react';
import { PixelRatio, Pressable, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { TruncatedText } from 'src/components/truncated-text';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { setTestID } from 'src/utils/test-id.utils';

import { itemStyles } from './styles';
import { RadioItemProps, ItemButtonInterface } from './types';

const SIZE = 24;

export const RadioItem: React.FC<RadioItemProps> = ({
  value,
  label,
  selected = false,
  color,
  containerStyle,
  labelStyle,
  buttons,
  onPress,
  testID
}) => {
  const borderWidth = PixelRatio.roundToNearestPixel(SIZE * 0.1);
  const sizeHalf = PixelRatio.roundToNearestPixel(SIZE * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(SIZE);

  const handlePress = onPress ? () => void onPress(value) : undefined;

  return (
    <Pressable onPress={handlePress} style={[itemStyles.container, containerStyle]} {...setTestID(testID)}>
      <View
        style={[
          itemStyles.border,
          {
            borderColor: color,
            borderWidth,
            width: sizeFull,
            height: sizeFull,
            borderRadius: sizeHalf
          }
        ]}
      >
        {selected && (
          <View
            style={{
              backgroundColor: color,
              width: sizeHalf,
              height: sizeHalf,
              borderRadius: sizeHalf
            }}
          />
        )}
      </View>

      {buttons && buttons.length && (
        <>
          <Divider size={formatSize(17)} />
          {buttons?.map(({ key, ...button }) => (
            <ItemButton key={key} {...button} />
          ))}
        </>
      )}

      <TruncatedText style={labelStyle}>{label}</TruncatedText>
    </Pressable>
  );
};

const ItemButton: React.FC<ItemButtonInterface> = ({ iconName, disabled, onPress }) => {
  const colors = useColors();

  const handlePress = disabled === true ? undefined : () => void onPress();

  return (
    <Pressable onPress={handlePress} style={{ padding: formatSize(6), marginLeft: formatSize(10) }}>
      <Icon name={iconName} color={disabled === true ? colors.disabled : undefined} />
    </Pressable>
  );
};
