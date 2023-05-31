import React, { memo } from 'react';

import { BakerInterface } from 'src/apis/baking-bad';
import { Divider } from 'src/components/divider/divider';
import { EventFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { SelectBakerItem } from '../select-baker-item/select-baker-item';

type BakerListItemProps = TestIdProps & {
  item: BakerInterface;
  selected: boolean;
  onPress: EventFn<BakerInterface>;
};

export const BakerListItem = memo<BakerListItemProps>(({ item, selected, onPress, testID }) => (
  <>
    <SelectBakerItem baker={item} selected={selected} onPress={() => onPress(item)} testID={testID} />
    <Divider size={formatSize(16)} />
  </>
));
