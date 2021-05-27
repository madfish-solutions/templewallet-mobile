import { useSelector } from 'react-redux';

import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { BakingRootState, BakingState } from './baking-state';

const useBakingSelector = () => useSelector<BakingRootState, BakingState>(({ baking }) => baking);

export const useSelectedBakerSelector = (): [BakerInterface, boolean] => {
  const selectedBaker = useBakingSelector().selectedBaker.data;
  const isBakerSelected = selectedBaker !== emptyBaker;

  return [selectedBaker, isBakerSelected];
};

export const useBakersListSelector = () => useBakingSelector().bakersList.data;
