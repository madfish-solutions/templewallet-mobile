import { BakerInterface, emptyBaker } from 'src/apis/baking-bad';

import { useSelector } from '../selector';

export const useSelectedBakerSelector = (): [BakerInterface, boolean] => {
  const selectedBaker = useSelector(state => state.baking.selectedBaker);
  const isBakerSelected = selectedBaker.address !== emptyBaker.address;

  return [selectedBaker, isBakerSelected];
};

export const useBakersListSelector = () => useSelector(state => state.baking.bakersList.data);

export const useBakerRewardsListSelector = () => useSelector(state => state.baking.bakerRewardsList.data);
