import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { EventFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';
import { formatSize } from '../../styles/format-size';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSorterStyles } from './sorter.styles';

interface Props<T extends string> extends TestIdProps {
  sortValue: T;
  description: string;
  sortFieldsOptions: Array<T>;
  sortFieldsLabels: Record<T, string>;
  onSetSortValue: EventFn<T>;
  bottomSheetContentHeight?: number;
  style?: ViewStyle;
}

export const Sorter = <T extends string>({
  style,
  sortValue,
  description,
  sortFieldsLabels,
  sortFieldsOptions,
  onSetSortValue,
  bottomSheetContentHeight = 260
}: Props<T>) => {
  const styles = useSorterStyles();
  const revealSelectBottomSheetController = useBottomSheetController();

  return (
    <View style={style}>
      <View style={styles.sortSelector}>
        <Text style={styles.sortByLabel}>Sort by</Text>
        <TouchableOpacity style={styles.selectedBakerFieldWrapper} onPress={revealSelectBottomSheetController.open}>
          <Text style={styles.selectedBakerSortField}>{sortFieldsLabels[sortValue]}</Text>
          <Icon size={formatSize(24)} name={IconNameEnum.TriangleDown} />
        </TouchableOpacity>
      </View>
      <BottomSheet
        description={description}
        contentHeight={formatSize(bottomSheetContentHeight)}
        controller={revealSelectBottomSheetController}
      >
        {sortFieldsOptions.map(value => (
          <BottomSheetActionButton
            key={value}
            title={sortFieldsLabels[value]}
            onPress={() => {
              onSetSortValue(value);
              revealSelectBottomSheetController.close();
            }}
          />
        ))}
      </BottomSheet>
    </View>
  );
};
