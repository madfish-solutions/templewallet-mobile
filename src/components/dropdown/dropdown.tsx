import { FlashList, FlashListProps, FlashListRef, ListRenderItem } from '@shopify/flash-list';
import React, { memo, ReactNode, Ref, useCallback, useMemo, useRef } from 'react';
import { StyleProp, Text, View, ViewStyle, ActivityIndicator, TouchableOpacity } from 'react-native';

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

export interface DropdownProps<T> extends Pick<FlashListProps<T>, 'keyExtractor'>, TestIdProps {
  description: string;
  list: T[];
  emptyListText?: string;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  renderSearchActionButtons?: DropdownActionButtonsComponent;
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
  const ref = useRef<FlashListRef<T>>(null);
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

  const listExtraData = useMemo(() => ({ itemsTitles, value }), [itemsTitles, value]);
  const contentHeight = useDropdownHeight();
  const renderItemSeparator = useCallback(() => <Divider size={listItemSeparatorSize} />, [listItemSeparatorSize]);
  const getItemType = useCallback(
    (_: T, index: number) => (isDefined(itemsTitles[index]) ? 'section-row' : 'row'),
    [itemsTitles]
  );

  const renderItem = useCallback<ListRenderItem<T>>(
    ({ item, index }) => {
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
    if (!isDefined(ref.current) || !isDefined(value) || list.length === 0) {
      return void 0;
    }
    const foundIndex = list.findIndex(item => equalityFn(item, value));
    const index = foundIndex > -1 ? foundIndex : 0;

    void ref.current.scrollToIndex({ index, animated: true }).catch(console.error);
  }, [equalityFn, value, list]);

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
            scroll();

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
            <FlashList
              ref={ref}
              data={list}
              extraData={listExtraData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getItemType={getItemType}
              contentContainerStyle={[
                styles.listContentContainer,
                isCompactListItem && styles.compactListContentContainer
              ]}
              ItemSeparatorComponent={renderItemSeparator}
              ListEmptyComponent={<DataPlaceholder text={emptyListText} />}
            />
          )}
        </View>

        {renderActionButtons({ closeDropdown })}
      </BottomSheet>
    </>
  );
};

export const Dropdown = memo(DropdownComponent) as typeof DropdownComponent;
