import { TouchableOpacity as BottomSheetTouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { emptyComponent, EmptyFn, EventFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';
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
  autoScroll?: boolean;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
  disabled?: boolean;
  comparator?: keyof T;
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

  const onPressTouch = useCallback(() => {
    console.log(autoScroll, comparator, value);
    if (!autoScroll || !isDefined(comparator) || !isDefined(value)) {
      return;
    }
    const scrollToIndex = list.findIndex(x => x[comparator] === value[comparator]);
    console.log('scroll', scrollToIndex, Boolean(scrollRef.current), dataSourceCords);
    if (dataSourceCords.length > scrollToIndex && isDefined(scrollRef.current)) {
      scrollRef.current.scrollTo({
        x: 0,
        y: dataSourceCords[scrollToIndex - 1],
        animated: true
      });
    }
  }, [scrollRef]);

  useEffect(() => {
    scrollRef.current ? onPressTouch() : setTimeout(onPressTouch, 50);
  }, [scrollRef]);

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
        <ScrollView style={styles.scrollView} ref={scrollRef}>
          <View style={styles.contentContainer}>
            {list.map((item, index) => {
              const isSelected = equalityFn(item, value);

              return (
                <BottomSheetTouchableOpacity
                  key={index}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    // console.log(layout);
                    dataSourceCords[index] = layout.height * index;
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
