import React from 'react';
import { PixelRatio, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { RadioItemProps, ItemButtonInterface } from './types';

export const RadioItem: React.FC<RadioItemProps> = ({
  borderColor,
  color = '#444',
  containerStyle,
  description,
  descriptionStyle,
  disabled = false,
  id,
  label,
  labelStyle,
  layout = 'row',
  buttons,
  onPress,
  selected = false,
  size = 24
}) => {
  const borderWidth = PixelRatio.roundToNearestPixel(size * 0.1);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  const orientation: ViewStyle = layout === 'column' ? { alignItems: 'center' } : { flexDirection: 'row' };
  const margin: ViewStyle = layout === 'column' ? { marginTop: 10 } : { marginLeft: 10 };

  const handlePress = !disabled && onPress ? () => void onPress(id) : undefined;

  const opacityStyle = { opacity: disabled ? 0.2 : 1 };

  return (
    <>
      <Pressable onPress={handlePress} style={[styles.container, orientation, opacityStyle, containerStyle]}>
        <View
          style={[
            styles.border,
            {
              borderColor: Boolean(borderColor) ? borderColor : color,
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
            {buttons?.map(button => (
              <ItemButton {...button} />
            ))}
          </>
        )}

        {Boolean(label) && <Text style={[margin, labelStyle]}>{label}</Text>}
      </Pressable>

      {Boolean(description) && <Text style={[margin, descriptionStyle]}>{description}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const ItemButton: React.FC<ItemButtonInterface> = ({ iconName, disabled, onPress }) => {
  const colors = useColors();

  const handlePress = disabled === true ? undefined : () => void onPress();

  return (
    <Pressable onPress={handlePress} style={{ padding: formatSize(6), marginLeft: formatSize(10) }}>
      <Icon name={iconName} color={disabled === true ? colors.disabled : undefined} />
    </Pressable>
  );
};
