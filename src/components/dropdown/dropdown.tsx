import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { emptyComponent, EmptyFn, EventFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { SearchInput } from '../search-input/search-input';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> {
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
  comparator?: Array<keyof T>;
  autoScroll?: boolean;
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

export const Dropdown = <T extends unknown>({
  value,
  list,
  title,
  disabled = false,
  autoScroll = false,
  isSearchable = false,
  setSearchValue,
  comparator,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  onValueChange,
  onLongPress
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const scrollRef = useRef<ScrollView>(null);
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = 0.7 * useWindowDimensions().height;
  const [dataSourceCords, setDataSourceCords] = useState<Array<number>>([]);
  const [lastScroll, setLastScroll] = useState(false);

  useEffect(() => {
    if (!autoScroll || !isDefined(comparator) || !isDefined(value) || lastScroll) {
      return;
    }
    const scrollToIndex = list.findIndex(x => comparator.every(key => x[key] === value[key]));
    if (dataSourceCords.length < scrollToIndex || !isDefined(scrollRef.current)) {
      return;
    }
    scrollRef.current.scrollTo({
      x: 0,
      y: dataSourceCords[scrollToIndex - 1],
      animated: true
    });
    setLastScroll(true);
  }, [scrollRef, dataSourceCords, list, value, comparator, autoScroll, lastScroll]);

  const createDropdownItemPressHandler = (item: T) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.valueContainer}
        disabled={disabled}
        onPress={() => {
          setLastScroll(false);
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
            {list.map((item, index) => {
              const isSelected = equalityFn(item, value);

              return (
                <BottomSheetTouchableOpacity
                  key={index}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    const itemPosition = layout.height * index;
                    dataSourceCords[index] = isDefined(itemPosition) ? itemPosition : 0;
                    setDataSourceCords(dataSourceCords);
                  }}
                  onPress={createDropdownItemPressHandler(item)}
                >
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
