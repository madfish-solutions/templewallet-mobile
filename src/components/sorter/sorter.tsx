import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useSorterStyles } from './sorter.styles';

interface Props<T extends string = string> {
  sortValue: T;
  description: string;
  sortFieldsOptions: Array<T>;
  sortFieldsLabels: Record<T, string>;
  onSetSortValue: (value: T) => void;
}

export const Sorter: FC<Props> = ({ sortValue, description, sortFieldsLabels, sortFieldsOptions, onSetSortValue }) => {
  const styles = useSorterStyles();
  const revealSelectBottomSheetController = useBottomSheetController();

  return (
    <View>
      <View style={styles.sortSelector}>
        <Text style={styles.sortByLabel}>Sort by</Text>
        <TouchableOpacity style={styles.selectedBakerFieldWrapper} onPress={revealSelectBottomSheetController.open}>
          <Text style={styles.selectedBakerSortField}>{sortFieldsLabels[sortValue]}</Text>
          <Icon size={formatSize(24)} name={IconNameEnum.TriangleDown} />
        </TouchableOpacity>
      </View>
      <BottomSheet
        description={description}
        contentHeight={formatSize(260)}
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
