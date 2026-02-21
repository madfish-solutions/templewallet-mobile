import { BottomSheetSectionList, TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { memo, useCallback } from 'react';
import { FlatListProps, ListRenderItemInfo, Text, View } from 'react-native';

import { emptyComponent, emptyFn } from 'src/config/general';
import { useDropdownHeight } from 'src/hooks/use-dropdown-height.hook';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
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
  isSearchable?: boolean;
  itemHeight?: number;
  setSearchValue?: SyncFn<string>;
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
  renderActionButtons?: DropdownActionButtonsComponent;
  onLongPress?: EmptyFn;
}

interface SectionDropdownValueProps<T> {
  value?: T;
  itemHeight?: number;
  list: Array<SectionDropdownDataInterface<T>>;
  disabled?: boolean;
  onValueChange: SyncFn<T | undefined>;
}

type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

type DropdownValueComponent<T> = SyncFC<{
  value?: T;
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
  onLongPress,
  testID,
  testIDProperties
}: SectionDropdownProps<T> & SectionDropdownValueProps<T>) => {
  const styles = useDropdownStyles();
  const dropdownBottomSheetController = useBottomSheetController();
  const contentHeight = useDropdownHeight();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const isSelected = equalityFn(item, value);

      const handlePress = () => {
        onValueChange(item);
        dropdownBottomSheetController.close();
      };

      return (
        <TouchableOpacity key={index} onPress={handlePress}>
          <DropdownItemContainer hasMargin={true} isSelected={isSelected}>
            {renderListItem({ item, isSelected })}
          </DropdownItemContainer>
        </TouchableOpacity>
      );
    },
    [equalityFn, value, onValueChange, dropdownBottomSheetController.close, renderListItem]
  );

  const scroll = useCallback(() => {
    if (!isDefined(value) || !isDefined(list) || list.length === 0) {
      return void 0;
    }
    let itemIndex = 0;
    let sectionIndex = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      for (let j = 0; j < item.data.length; j++) {
        if (equalityFn(item.data[j], value)) {
          itemIndex = j;
          sectionIndex = i;
          break;
        }
      }
      if (itemIndex !== 0 || sectionIndex !== 0) {
        break;
      }
    }
  }, [value, list]);

  return (
    <>
      <TouchableWithAnalytics
        style={styles.valueContainer}
        disabled={disabled}
        testID={testID}
        testIDProperties={testIDProperties}
        onPress={() => {
          scroll();

          return dropdownBottomSheetController.open();
        }}
        onLongPress={onLongPress}
      >
        {renderValue({ value, disabled })}
      </TouchableWithAnalytics>

      <BottomSheet description={description} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search" onChangeText={setSearchValue} />}
          <BottomSheetSectionList
            sections={list}
            getItemLayout={createGetItemLayout(itemHeight)}
            contentContainerStyle={styles.flatListContentContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            // @ts-expect-error - TODO: fix this
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeaderText}>{title}</Text>}
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

export const SectionDropdown = memo(SectionDropdownComponent) as typeof SectionDropdownComponent;
