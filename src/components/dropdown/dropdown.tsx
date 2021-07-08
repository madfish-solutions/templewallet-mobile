import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { emptyComponent, EmptyFn, EventFn } from '../../config/general';
import { conditionalStyle } from '../../utils/conditional-style';
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
  style?: 'default' | 'nativeLike';
  contentHeight?: number;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
  onValueChange: EventFn<T | undefined>;
}

export type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

export type DropdownValueComponent<T> = FC<{
  value?: T;
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
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  onValueChange,
  style = 'default',
  contentHeight
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const defaultContentHeight = 0.5 * useWindowDimensions().height;
  const styleIsDefault = style === 'default';

  const createDropdownItemPressHandler = (item: T) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.valueContainer, conditionalStyle(!styleIsDefault, styles.nativeLikeValueContainer)]}
        onPress={dropdownBottomSheetController.open}>
        {renderValue({ value })}
      </TouchableOpacity>

      <BottomSheet
        title={title}
        contentHeight={contentHeight ?? defaultContentHeight}
        controller={dropdownBottomSheetController}>
        <ScrollView style={[styles.scrollView, conditionalStyle(!styleIsDefault, styles.nativeLikeScrollView)]}>
          <View style={[styles.contentContainer, conditionalStyle(!styleIsDefault, styles.nativeLikeContentContainer)]}>
            {list.map((item, index) => {
              const isSelected = equalityFn(item, value);

              return (
                <BottomSheetTouchableOpacity key={index} onPress={createDropdownItemPressHandler(item)}>
                  <DropdownItemContainer
                    hasMargin={styleIsDefault}
                    isSelected={isSelected && styleIsDefault}
                    style={conditionalStyle(!styleIsDefault, styles.nativeLikeItemContainer)}>
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
