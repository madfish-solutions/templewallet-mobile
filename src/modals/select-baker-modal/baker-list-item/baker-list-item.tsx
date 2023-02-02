import React, { memo } from 'react';

import { BakerInterface } from 'src/apis/baking-bad';
import { Divider } from 'src/components/divider/divider';
import { EventFn } from 'src/config/general';
import { formatSize } from 'src/styles/format-size';

import { SelectBakerItem } from '../select-baker-item/select-baker-item';

type BakerListItemProps = {
  item: BakerInterface;
  selected: boolean;
  onPress: EventFn<BakerInterface>;
};

export const BakerListItem = memo<BakerListItemProps>(({ item, selected, onPress }) => (
  <>
    <SelectBakerItem baker={item} selected={selected} onPress={() => onPress(item)} />
    <Divider size={formatSize(16)} />
  </>
));
