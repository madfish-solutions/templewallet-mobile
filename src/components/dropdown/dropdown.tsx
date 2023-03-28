import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { FlatListProps, ListRenderItemInfo, StyleProp, View, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { emptyComponent, emptyFn, EmptyFn, EventFn } from 'src/config/general';
import { useDropdownHeight } from 'src/hooks/use-dropdown-height.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { SearchInput } from '../search-input/search-input';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> extends Pick<FlatListProps<T>, 'keyExtractor'>, TestIdProps {
  description: string;
  list: T[];
  isSearchable?: boolean;
  itemHeight?: number;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTestIDPrefix?: string;
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

const ListEmptyComponent = <DataPlaceholder text="No assets found." />;

const DropdownComponent = <T extends unknown>({
  value,
  list,
  description,
  itemHeight = formatSize(64),
  itemContainerStyle,
  itemTestIDPrefix,
  disabled = false,
  isSearchable = false,
  setSearchValue = emptyFn,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  keyExtractor,
  testID,
  onValueChange,
  onLongPress
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const ref = useRef<FlatList<T>>(null);
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const getItemLayout = useMemo(() => createGetItemLayout<T>(itemHeight), [itemHeight]);
  const contentHeight = useDropdownHeight();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const isSelected = equalityFn(item, value);

      const handlePress = () => {
        onValueChange(item);
        dropdownBottomSheetController.close();
      };

      return (
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          testID={isDefined(itemTestIDPrefix) ? `${itemTestIDPrefix}/${index}` : undefined}
        >
          <DropdownItemContainer hasMargin={true} isSelected={isSelected} style={itemContainerStyle}>
            {renderListItem({ item, isSelected })}
          </DropdownItemContainer>
        </TouchableOpacity>
      );
    },
    [equalityFn, value, onValueChange, dropdownBottomSheetController.close, renderListItem, itemTestIDPrefix]
  );

  const scroll = useCallback(() => {
    if (!isDefined(ref.current) || !isDefined(value) || !isDefined(list) || list.length === 0) {
      return void 0;
    }
    const foundIndex = list.findIndex(item => equalityFn(item, value));
    const index = foundIndex > -1 ? foundIndex : 0;
    if (foundIndex >= list.length) {
      return void 0;
    }
    ref.current.scrollToIndex({ index, animated: true });
  }, [value, list]);

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
        testID={testID}
      >
        {renderValue({ value, disabled })}
      </TouchableOpacity>

      <BottomSheet description={description} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />}
          <FlatList
            ref={ref}
            data={list}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            contentContainerStyle={styles.flatListContentContainer}
            ListEmptyComponent={ListEmptyComponent}
            windowSize={10}
            updateCellsBatchingPeriod={150}
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
