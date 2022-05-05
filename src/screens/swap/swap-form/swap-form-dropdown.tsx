import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, ReactNode, useRef } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import { BottomSheet } from '../../../components/bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { DropdownItemContainer } from '../../../components/dropdown/dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from '../../../components/dropdown/dropdown.styles';
import { SearchInput } from '../../../components/search-input/search-input';
import { emptyComponent, EmptyFn, EventFn } from '../../../config/general';
import { TokenInterface } from '../../../token/interfaces/token.interface';

export interface SwapFormDropdownProps<T> {
  title: string;
  list: T[];
  isSearchable?: boolean;
  setSearchValue?: EventFn<string>;
  equalityFn: SwapFormDropdownEqualityFn<T>;
  renderValue: SwapFormDropdownValueComponent<T>;
  renderListItem: SwapFormDropdownListItemComponent<T>;
  renderActionButtons?: SwapFormDropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
  autoScroll?: boolean;
}

export interface SwapFormDropdownValueProps<T> {
  value?: T;
  list: T[];
  disabled?: boolean;
  comparator?: Array<keyof T>;
  autoScroll?: boolean;
  onValueChange: EventFn<T | undefined>;
}

export type SwapFormDropdownValueBaseProps<T> = SwapFormDropdownValueProps<T> & {
  renderValue: SwapFormDropdownValueComponent<T>;
  renderAccountListItem: SwapFormDropdownListItemComponent<T>;
};

export type SwapFormDropdownEqualityFn<T> = (item: T, value?: T) => boolean;

export type SwapFormDropdownValueComponent<T> = FC<{
  value?: T;
  disabled?: boolean;
}>;

export type SwapFormDropdownListItemComponent<T> = FC<{
  item: T;
  isSelected: boolean;
}>;

export type SwapFormDropdownActionButtonsComponent = FC<{
  onPress: EmptyFn;
}>;

export const SwapFormDropdown = ({
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
  onValueChange,
  onLongPress
}: SwapFormDropdownProps<TokenInterface> & SwapFormDropdownValueProps<TokenInterface>) => {
  const styles = useDropdownStyles();
  const scrollRef = useRef<ScrollView>(null);
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = 0.7 * useWindowDimensions().height;
  const createDropdownItemPressHandler = (item: TokenInterface) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  console.log('SwapFormDropdown', title);

  return (
    <>
      <TouchableOpacity
        style={styles.valueContainer}
        disabled={disabled}
        onPress={() => {
          dropdownBottomSheetController.open();
        }}
        onLongPress={onLongPress}
      >
        {renderValue({ value, disabled })}
      </TouchableOpacity>

      <BottomSheet title={title} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <ScrollView style={styles.scrollView} ref={scrollRef}>
          {isSearchable && <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />}
          <View style={styles.contentContainer}>
            <FlatList
              data={list}
              keyExtractor={item => `${item.address}_${item.id}`}
              renderItem={({ item, index }) => (
                <DropdownListItem
                  item={item}
                  index={index}
                  isSelected={equalityFn(item, value)}
                  onPress={createDropdownItemPressHandler(item)}
                  renderListItem={() => renderListItem({ item, isSelected: equalityFn(item, value) })}
                />
              )}
            />
          </View>
        </ScrollView>

        {renderActionButtons({ onPress: () => dropdownBottomSheetController.close() })}
      </BottomSheet>
    </>
  );
};

interface DropdownListItemProps<T> {
  item: T;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  renderListItem: ({ item, isSelected }: { item: T; isSelected: boolean }) => ReactNode | null;
}

const DropdownListItem = <T extends unknown>({
  item,
  isSelected,
  index,
  renderListItem,
  onPress
}: DropdownListItemProps<T>) => (
  <BottomSheetTouchableOpacity key={index} onPress={onPress}>
    <DropdownItemContainer hasMargin={true} isSelected={isSelected}>
      {renderListItem({ item, isSelected })}
    </DropdownItemContainer>
  </BottomSheetTouchableOpacity>
);
