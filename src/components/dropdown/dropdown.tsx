import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, memo, useCallback, useState } from 'react';
import { FlatListProps, ListRenderItemInfo, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { emptyComponent, emptyFn, EmptyFn, EventFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { SearchInput } from '../search-input/search-input';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> extends Pick<FlatListProps<T>, 'keyExtractor'> {
  title: string;
  list: T[];
  isSearchable?: boolean;
  itemHeight?: number;
  setSearchValue?: EventFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
}

export interface DropdownValueProps<T> {
  value?: T;
  itemHeight?: number;
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
  itemHeight = formatSize(64),
  disabled = false,
  isSearchable = false,
  setSearchValue = emptyFn,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  keyExtractor,
  onValueChange,
  onLongPress
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const [ref, setRef] = useState<FlatList<T> | null>(null);
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

  const scroll = useCallback(() => {
    if (!isDefined(ref) || !isDefined(value) || !isDefined(list) || list.length === 0) {
      return void 0;
    }
    const foundIndex = list.findIndex(item => equalityFn(item, value));
    const index = foundIndex > -1 ? foundIndex : 0;
    if (foundIndex >= list.length) {
      return void 0;
    }
    ref.scrollToIndex({ index, animated: true });
  }, [ref, value, list]);

  return (
    <>
      <TouchableOpacity
        style={styles.valueContainer}
        disabled={disabled}
        onPress={() => {
          scroll();

          return dropdownBottomSheetController.open();
        }}
        onLongPress={onLongPress}
      >
        {renderValue({ value, disabled })}
      </TouchableOpacity>

      <BottomSheet title={title} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />}
          <FlatList
            data={list}
            ref={ref => {
              setRef(ref);
            }}
            getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
            contentContainerStyle={styles.flatListContentContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={<DataPlaceholder text="No assets found." />}
          />
        </View>

        {renderActionButtons({
          onPress: () => dropdownBottomSheetController.close()
        })}
      </BottomSheet>
    </>
  );
};

export const Dropdown = memo(DropdownComponent) as typeof DropdownComponent;
