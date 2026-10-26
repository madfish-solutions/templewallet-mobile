import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatListProps, ListRenderItemInfo, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { emptyComponent, emptyFn } from 'src/config/general';
import { useDropdownHeight } from 'src/hooks/use-dropdown-height.hook';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { SearchInput } from '../search-input/search-input';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './styles';

export interface SectionDropdownProps<T> extends TestIdProps, Pick<FlatListProps<T>, 'keyExtractor'> {
  description: string;
  list: Array<SectionDropdownDataInterface<T>>;
  emptyListText?: string;
  isSearchable?: boolean;
  itemHeight?: number;
  setSearchValue?: SyncFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  itemContainerStyle?: StyleProp<ViewStyle>;
  showCloseButton?: boolean;
  onLongPress?: EmptyFn;
}

interface SectionDropdownValueProps<T> {
  value: T;
  itemHeight?: number;
  list: Array<SectionDropdownDataInterface<T>>;
  disabled?: boolean;
  onValueChange: SyncFn<T>;
}

type DropdownEqualityFn<T> = (item: T, value: T) => boolean;

type DropdownValueComponent<T> = SyncFC<{
  value: T;
  disabled?: boolean;
}>;

type DropdownListItemComponent<T> = SyncFC<{
  item: T;
  isSelected: boolean;
}>;

type DropdownActionButtonsComponent = SyncFC<{
  onPress: EmptyFn;
}>;

const SectionDropdownComponent = <T extends unknown>({
  value,
  list,
  description,
  emptyListText = 'No assets found.',
  itemHeight = formatSize(64),
  disabled = false,
  isSearchable = false,
  setSearchValue = emptyFn,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons = emptyComponent,
  itemContainerStyle,
  showCloseButton = false,
  keyExtractor,
  onValueChange,
  onLongPress,
  testID,
  testIDProperties
}: SectionDropdownProps<T> & SectionDropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = useDropdownHeight();
  const [searchInputKey, setSearchInputKey] = useState(0);

  const itemsTitles = useMemo(() => {
    const { titles } = list.reduce<{ sum: number; titles: Record<number, string | undefined> }>(
      (acc, section) => {
        acc.titles[acc.sum] = section.title;
        acc.sum += section.data.length;

        return acc;
      },
      { sum: 0, titles: {} }
    );

    return titles;
  }, [list]);

  const flatList = useMemo(() => list.flatMap(section => section.data), [list]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => {
      const sectionTitle = itemsTitles[index];
      const sectionsTitlesBeforeCount = Object.keys(itemsTitles).filter(key => Number(key) < index).length;
      const sectionTitleSize = formatSize(22);

      return {
        length: itemHeight + (sectionTitle ? sectionTitleSize : 0),
        index,
        offset: index * itemHeight + sectionsTitlesBeforeCount * sectionTitleSize
      };
    },
    [itemsTitles, itemHeight]
  );

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
          {isDefined(sectionTitle) && (
            <View>
              <Text style={styles.sectionHeaderText}>{sectionTitle}</Text>
            </View>
          )}
          <TouchableOpacity key={index} onPress={handlePress}>
            <DropdownItemContainer hasMargin isSelected={isSelected} style={itemContainerStyle}>
              {renderListItem({ item, isSelected })}
            </DropdownItemContainer>
          </TouchableOpacity>
        </>
      );
    },
    [
      equalityFn,
      value,
      onValueChange,
      dropdownBottomSheetController,
      renderListItem,
      itemContainerStyle,
      itemsTitles,
      styles.sectionHeaderText
    ]
  );

  const handleOpen = useCallback(() => {
    dropdownBottomSheetController.open();
  }, [dropdownBottomSheetController]);

  const handleClose = useCallback(() => {
    if (isSearchable) {
      setSearchValue('');
      setSearchInputKey(value => value + 1);
    }
  }, [isSearchable, setSearchValue]);

  return (
    <>
      <TouchableWithAnalytics
        style={styles.valueContainer}
        disabled={disabled}
        testID={testID}
        testIDProperties={testIDProperties}
        onPress={handleOpen}
        onLongPress={onLongPress}
      >
        {renderValue({ value, disabled })}
      </TouchableWithAnalytics>

      <BottomSheet
        description={description}
        contentHeight={contentHeight}
        controller={dropdownBottomSheetController}
        showCloseButton={showCloseButton}
        showCancelButton={!showCloseButton}
        onClose={handleClose}
      >
        <View style={styles.contentContainer}>
          {isSearchable && (
            <View style={styles.searchContainer}>
              <SearchInput
                key={searchInputKey}
                containerStyle={styles.searchInputContainer}
                placeholder="Search"
                onChangeText={setSearchValue}
              />
            </View>
          )}
          <FlatList
            data={flatList}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={<DataPlaceholder text={emptyListText} />}
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

export const SectionDropdown = memo(SectionDropdownComponent) as typeof SectionDropdownComponent;
