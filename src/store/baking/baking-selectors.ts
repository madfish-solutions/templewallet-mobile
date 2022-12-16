import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { useSelector } from '../selector';

const useBakingSelector = () => useSelector(({ baking }) => baking);

export const useSelectedBakerSelector = (): [BakerInterface, boolean] => {
  const selectedBaker = useBakingSelector().selectedBaker;
  const isBakerSelected = selectedBaker.address !== emptyBaker.address;

  return [selectedBaker, isBakerSelected];
};

export const useBakersListSelector = () => useBakingSelector().bakersList.data;

export const useKnownBakerSelector = (bakerAddress: string) => {
  const bakersList = useBakersListSelector();

  return bakersList.find(baker => baker.address === bakerAddress);
};

export const useBakerRewardsListSelector = () => useBakingSelector().bakerRewardsList.data;
