import React from 'react';
import { PixelRatio, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { ItemProps } from './types';

export function RadioItem({
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
  onPress,
  onEditPress,
  selected = false,
  size = 24,
  editDisabled
}: ItemProps) {
  const colors = useColors();

  const borderWidth = PixelRatio.roundToNearestPixel(size * 0.1);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  let orientation: ViewStyle = { flexDirection: 'row' };
  let margin: ViewStyle = { marginLeft: 10 };

  if (layout === 'column') {
    orientation = { alignItems: 'center' };
    margin = { marginTop: 10 };
  }

  const handlePress = !disabled && onPress ? () => void onPress(id) : undefined;

  const handleEditPress =
    disabled === false && Boolean(editDisabled) === false && onEditPress ? () => void onEditPress(id) : undefined;

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

        {onEditPress && (
          <>
            <Divider size={formatSize(20)} />

            <Pressable onPress={handleEditPress} style={{ padding: formatSize(6) }}>
              <Icon
                name={IconNameEnum.Edit}
                size={formatSize(11.41)}
                color={editDisabled === true ? colors.disabled : undefined}
              />
            </Pressable>
          </>
        )}

        {Boolean(label) && <Text style={[margin, labelStyle]}>{label}</Text>}
      </Pressable>

      {Boolean(description) && <Text style={[margin, descriptionStyle]}>{description}</Text>}
    </>
  );
}

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
