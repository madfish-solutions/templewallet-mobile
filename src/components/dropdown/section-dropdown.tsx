import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, memo, useCallback, useState } from 'react';
import { FlatListProps, ListRenderItemInfo, SectionList, Text, View } from 'react-native';

import { emptyComponent, emptyFn, EmptyFn, EventFn } from '../../config/general';
import { useDropdownHeight } from '../../hooks/use-dropdown-height.hook';
import { SectionDropdownDataInterface } from '../../interfaces/section-dropdown-data.interface';
import { formatSize } from '../../styles/format-size';
import { createGetItemLayout } from '../../utils/flat-list.utils';
import { isDefined } from '../../utils/is-defined';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../data-placeholder/data-placeholder';
import { SearchInput } from '../search-input/search-input';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { useDropdownStyles } from './dropdown.styles';

export interface SectionDropdownProps<T> extends Pick<FlatListProps<T>, 'keyExtractor'> {
  description: string;
  list: Array<SectionDropdownDataInterface<T>>;
  isSearchable?: boolean;
  itemHeight?: number;
  setSearchValue?: EventFn<string>;
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
  onValueChange: EventFn<T | undefined>;
}

type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

type DropdownValueComponent<T> = FC<{
  value?: T;
  disabled?: boolean;
}>;

type DropdownListItemComponent<T> = FC<{
  item: T;
  isSelected: boolean;
}>;

type DropdownActionButtonsComponent = FC<{
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
  onLongPress
}: SectionDropdownProps<T> & SectionDropdownValueProps<T>) => {
  const [ref, setRef] = useState<SectionList<T, SectionDropdownDataInterface<T>> | null>(null);
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
    if (!isDefined(ref) || !isDefined(value) || !isDefined(list) || list.length === 0) {
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
    ref.scrollToLocation({
      itemIndex,
      sectionIndex,
      animated: true
    });
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

      <BottomSheet description={description} contentHeight={contentHeight} controller={dropdownBottomSheetController}>
        <View style={styles.contentContainer}>
          {isSearchable && <SearchInput placeholder="Search" onChangeText={setSearchValue} />}
          <SectionList
            sections={list}
            ref={ref => setRef(ref)}
            getItemLayout={createGetItemLayout(itemHeight)}
            contentContainerStyle={styles.flatListContentContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
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
