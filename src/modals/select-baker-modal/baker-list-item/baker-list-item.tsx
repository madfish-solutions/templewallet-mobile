import React, { memo } from 'react';

import { Divider } from '../../../components/divider/divider';
import { EventFn } from '../../../config/general';
import { BakerInterface } from '../../../interfaces/baker.interface';
import { formatSize } from '../../../styles/format-size';
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
