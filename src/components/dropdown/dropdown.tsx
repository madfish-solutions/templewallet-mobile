import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import { FlatListProps, ListRenderItemInfo, StyleProp, View, ViewStyle, ActivityIndicator } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { emptyComponent } from 'src/config/general';
import { useDropdownHeight } from 'src/hooks/use-dropdown-height.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { SearchInput } from '../search-input/search-input';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { DropdownSelectors } from './selectors';
import { useDropdownStyles } from './styles';

export interface DropdownProps<T> extends Pick<FlatListProps<T>, 'keyExtractor'>, TestIdProps {
  description: string;
  list: T[];
  emptyListText?: string;
  isSearchable?: boolean;
  itemHeight?: number;
  itemContainerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  setSearchValue?: SyncFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
}

export interface DropdownValueProps<T> extends TestIdProps {
  value?: T;
  itemHeight?: number;
  list: T[];
  disabled?: boolean;
  isCollectibleScreen?: boolean;
  onValueChange: SyncFn<T | undefined>;
  itemTestIDPropertiesFn?: (value: T) => object | undefined;
}

export type DropdownValueBaseProps<T> = DropdownValueProps<T> & {
  renderValue: DropdownValueComponent<T>;
  renderAccountListItem: DropdownListItemComponent<T>;
} & TestIdProps;

export type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

export type DropdownValueComponent<T> = FC<
  { value?: T; disabled?: boolean; isCollectibleScreen?: boolean } & TestIdProps
>;

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
  emptyListText = 'No assets found.',
  description,
  itemHeight = formatSize(64),
  itemContainerStyle,
  disabled = false,
  isLoading = false,
  isSearchable = false,
  isCollectibleScreen = false,
  setSearchValue,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  keyExtractor,
  onValueChange,
  onLongPress,
  testID,
  testIDProperties,
  itemTestIDPropertiesFn
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const { trackEvent } = useAnalytics();
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
        <TouchableWithAnalytics
          Component={TouchableOpacity}
          key={index}
          onPress={handlePress}
          testID={DropdownSelectors.option}
          testIDProperties={itemTestIDPropertiesFn?.(item)}
        >
          <DropdownItemContainer hasMargin={true} isSelected={isSelected} style={itemContainerStyle}>
            {renderListItem({ item, isSelected })}
          </DropdownItemContainer>
        </TouchableWithAnalytics>
      );
    },
    [equalityFn, value, onValueChange, dropdownBottomSheetController.close, renderListItem, itemTestIDPropertiesFn]
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

          trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);

          return dropdownBottomSheetController.open();
        }}
        onLongPress={onLongPress}
        testID={testID}
      >
        {renderValue({ value, disabled, isCollectibleScreen })}
      </TouchableOpacity>

      <BottomSheet description={description} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />}
          {isLoading ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              ref={ref}
              data={list}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.flatListContentContainer}
              ListEmptyComponent={<DataPlaceholder text={emptyListText} />}
              windowSize={10}
              updateCellsBatchingPeriod={150}
            />
          )}
        </View>

        {renderActionButtons({
          onPress: () => dropdownBottomSheetController.close()
        })}
      </BottomSheet>
    </>
  );
};

export const Dropdown = memo(DropdownComponent) as typeof DropdownComponent;
