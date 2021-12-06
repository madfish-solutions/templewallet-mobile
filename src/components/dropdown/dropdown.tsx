import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { emptyComponent, EmptyFn, EventFn } from '../../config/general';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> {
  title: string;
  list: T[];
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
  disabled?: boolean;
  onValueChange: EventFn<T | undefined>;
}

export type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

export type DropdownValueComponent<T> = FC<{
  value?: T;
  disabled?: boolean;
}>;

export type DropdownListItemComponent<T> = FC<{
  item: T;
  isSelected: boolean;
}>;

export type DropdownActionButtonsComponent = FC<{
  onPress: EmptyFn;
}>;

export const Dropdown = <T extends unknown>({
  value,
  list,
  title,
  disabled = false,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  onValueChange,
  onLongPress
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = 0.7 * useWindowDimensions().height;

  const createDropdownItemPressHandler = (item: T) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.valueContainer}
        disabled={disabled}
        onPress={dropdownBottomSheetController.open}
        onLongPress={onLongPress}
      >
        {renderValue({ value, disabled })}
      </TouchableOpacity>

      <BottomSheet title={title} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {list.map((item, index) => {
              const isSelected = equalityFn(item, value);

              return (
                <BottomSheetTouchableOpacity key={index} onPress={createDropdownItemPressHandler(item)}>
                  <DropdownItemContainer hasMargin={true} isSelected={isSelected}>
                    {renderListItem({ item, isSelected })}
                  </DropdownItemContainer>
                </BottomSheetTouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {renderActionButtons({ onPress: () => dropdownBottomSheetController.close() })}
      </BottomSheet>
    </>
  );
};
