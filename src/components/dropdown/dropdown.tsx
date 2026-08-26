import React, { memo, ReactNode, Ref, useCallback, useMemo, useRef } from 'react';
import {
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  Text,
  View,
  ViewStyle,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { emptyComponent } from 'src/config/general';
import { useDropdownHeight } from 'src/hooks/use-dropdown-height.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { Divider } from '../divider/divider';
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
  searchPlaceholder?: string;
  renderSearchActionButtons?: DropdownActionButtonsComponent;
  listItemHeight?: number;
  listItemSeparatorSize?: number;
  listItemDividerSize?: number;
  isCompactListItem?: boolean;
  itemContainerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  setSearchValue?: SyncFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  getListItemSectionTitle?: (item: T) => string | undefined;
  renderActionButtons?: DropdownActionButtonsComponent;
  listHeader?: ReactNode;
  showCloseButton?: boolean;
  scrollToSelectedOnOpen?: boolean;
  triggerWrapperRef?: Ref<View>;
  onLongPress?: EmptyFn;
}

export interface DropdownValueProps<T> extends TestIdProps {
  value?: T;
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

export type DropdownValueComponent<T> = SyncFC<
  { value?: T; disabled?: boolean; isCollectibleScreen?: boolean } & TestIdProps
>;

export type DropdownListItemComponent<T> = SyncFC<{
  item: T;
  isSelected: boolean;
}>;

export type DropdownActionButtonsComponent = SyncFC<{
  closeDropdown: (onClosed?: EmptyFn) => void;
}>;

const DropdownComponent = <T extends unknown>({
  value,
  list,
  emptyListText = 'No assets found.',
  description,
  listItemHeight = formatSize(64),
  listItemSeparatorSize = formatSize(16),
  listItemDividerSize = formatSize(8),
  isCompactListItem = false,
  itemContainerStyle,
  disabled = false,
  isLoading = false,
  isSearchable = false,
  searchPlaceholder = 'Search',
  renderSearchActionButtons,
  isCollectibleScreen = false,
  setSearchValue,
  equalityFn,
  renderValue,
  renderListItem,
  showCloseButton = true,
  scrollToSelectedOnOpen = true,
  getListItemSectionTitle,
  renderActionButtons = emptyComponent,
  listHeader,
  keyExtractor,
  onValueChange,
  onLongPress,
  testID,
  testIDProperties,
  itemTestIDPropertiesFn,
  triggerWrapperRef
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const { trackEvent } = useAnalytics();
  const ref = useRef<FlatList<T>>(null);
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const afterCloseRef = useRef<EmptyFn>(undefined);

  const itemsTitles = useMemo(() => {
    const result: Record<number, string | undefined> = {};
    let previousSectionTitle: string | undefined;
    list.forEach((item, index) => {
      const sectionTitle = getListItemSectionTitle?.(item);
      if (sectionTitle !== previousSectionTitle) {
        result[index] = sectionTitle;
        previousSectionTitle = sectionTitle;
      }
    });

    return result;
  }, [getListItemSectionTitle, list]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => {
      const sectionTitle = itemsTitles[index];
      const sectionsTitlesBeforeCount = Object.keys(itemsTitles).filter(key => Number(key) < index).length;
      const rowDividerSize = listItemDividerSize;
      const sectionTitleSize = formatSize(22);
      const itemSeparatorSize = listItemSeparatorSize;

      return {
        length: listItemHeight + rowDividerSize + (sectionTitle ? sectionTitleSize : 0),
        index,
        offset:
          index * (listItemHeight + rowDividerSize + itemSeparatorSize) + sectionsTitlesBeforeCount * sectionTitleSize
      };
    },
    [itemsTitles, listItemDividerSize, listItemHeight, listItemSeparatorSize]
  );
  const contentHeight = useDropdownHeight();
  const renderItemSeparator = useCallback(() => <Divider size={listItemSeparatorSize} />, [listItemSeparatorSize]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const isSelected = equalityFn(item, value);
      const sectionTitle = itemsTitles[index];

      const handlePress = () => {
        onValueChange(item);
        dropdownBottomSheetController.close();
      };

      return (
        <>
          {isDefined(sectionTitle) && <Text style={styles.sectionHeaderText}>{sectionTitle}</Text>}
          {listItemDividerSize > 0 && <Divider size={listItemDividerSize} />}
          <TouchableWithAnalytics
            Component={TouchableOpacity}
            key={index}
            onPress={handlePress}
            testID={DropdownSelectors.option}
            testIDProperties={itemTestIDPropertiesFn?.(item)}
          >
            <DropdownItemContainer isSelected={isSelected} isCompact={isCompactListItem} style={itemContainerStyle}>
              {renderListItem({ item, isSelected })}
            </DropdownItemContainer>
          </TouchableWithAnalytics>
        </>
      );
    },
    [
      equalityFn,
      value,
      itemsTitles,
      onValueChange,
      dropdownBottomSheetController.close,
      itemTestIDPropertiesFn,
      isCompactListItem,
      listItemDividerSize,
      styles.sectionHeaderText,
      itemContainerStyle,
      renderListItem
    ]
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

    try {
      ref.current.scrollToIndex({ index, animated: true });
    } catch (e) {
      console.error(e);
    }
  }, [value, list]);

  const closeDropdown = useCallback(
    (onClosed?: EmptyFn) => {
      afterCloseRef.current = onClosed;
      dropdownBottomSheetController.close({ duration: 100 });
    },
    [dropdownBottomSheetController.close]
  );

  const handleDropdownClose = useCallback(() => {
    const callback = afterCloseRef.current;
    afterCloseRef.current = undefined;
    callback?.();
  }, []);

  return (
    <>
      <View style={styles.valueContainer} ref={triggerWrapperRef}>
        <TouchableOpacity
          style={styles.valueContainer}
          disabled={disabled}
          onPress={() => {
            if (scrollToSelectedOnOpen) {
              scroll();
            }

            trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);

            return dropdownBottomSheetController.open();
          }}
          onLongPress={onLongPress}
          testID={testID}
        >
          {renderValue({ value, disabled, isCollectibleScreen })}
        </TouchableOpacity>
      </View>

      <BottomSheet
        description={description}
        contentHeight={contentHeight}
        controller={dropdownBottomSheetController}
        showCloseButton={showCloseButton}
        showCancelButton={!showCloseButton}
        onClose={handleDropdownClose}
      >
        <View style={styles.contentContainer}>
          {isSearchable && (
            <View style={styles.searchContainer}>
              <SearchInput
                containerStyle={styles.searchInputContainer}
                placeholder={searchPlaceholder}
                onChangeText={setSearchValue}
              />
              {renderSearchActionButtons && (
                <>
                  <Divider size={formatSize(24)} />
                  {renderSearchActionButtons({ closeDropdown })}
                </>
              )}
            </View>
          )}
          {listHeader}
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
              contentContainerStyle={[
                styles.listContentContainer,
                isCompactListItem && styles.compactListContentContainer
              ]}
              ItemSeparatorComponent={renderItemSeparator}
              ListEmptyComponent={<DataPlaceholder text={emptyListText} />}
              windowSize={10}
              updateCellsBatchingPeriod={150}
            />
          )}
        </View>

        {renderActionButtons({ closeDropdown })}
      </BottomSheet>
    </>
  );
};

export const Dropdown = memo(DropdownComponent) as typeof DropdownComponent;
