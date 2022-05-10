import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, memo, useCallback } from 'react';
import { FlatListProps, ListRenderItemInfo, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { emptyComponent, EmptyFn, EventFn } from '../../config/general';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { SearchInput } from '../search-input/search-input';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> extends Pick<FlatListProps<T>, 'keyExtractor'> {
  title: string;
  list: T[];
  isSearchable?: boolean;
  setSearchValue?: EventFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
  autoScroll?: boolean;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
  disabled?: boolean;
  onValueChange: EventFn<T | undefined>;
}

export type DropdownValueBaseProps<T> = DropdownValueProps<T> & {
  renderValue: DropdownValueComponent<T>;
  renderAccountListItem: DropdownListItemComponent<T>;
};

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

const DropdownComponent = <T extends unknown>({
  value,
  list,
  title,
  disabled = false,
  isSearchable = false,
  setSearchValue,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  keyExtractor,
  onValueChange,
  onLongPress
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = 0.7 * useWindowDimensions().height;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const isSelected = equalityFn(item, value);

      const handlePress = () => {
        onValueChange(item);
        dropdownBottomSheetController.close();
      };

      return (
        <BottomSheetTouchableOpacity key={index} onPress={handlePress}>
          <DropdownItemContainer hasMargin={true} isSelected={isSelected}>
            {renderListItem({ item, isSelected })}
          </DropdownItemContainer>
        </BottomSheetTouchableOpacity>
      );
    },
    [equalityFn, value, onValueChange, dropdownBottomSheetController.close, renderListItem]
  );

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
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />}
          <FlatList
            data={list}
            contentContainerStyle={styles.flatListContentContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </View>

        {renderActionButtons({ onPress: () => dropdownBottomSheetController.close() })}
      </BottomSheet>
    </>
  );
};

export const Dropdown = memo(DropdownComponent) as typeof DropdownComponent;
