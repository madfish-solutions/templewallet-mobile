import { useSelector } from 'react-redux';

import { BakingRootState, BakingState } from './baking-state';

const useBakingSelector = () => useSelector<BakingRootState, BakingState>(({ baking }) => baking);

export const useSelectedBakerSelector = () => useBakingSelector().selectedBaker;

export const useBakersListSelector = () => useBakingSelector().bakersList;
