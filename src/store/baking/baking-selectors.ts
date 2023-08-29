import { useMemo } from 'react';

import { BakerInterface, emptyBaker } from 'src/apis/baking-bad';
import { KNOWN_BAKERS, KnownBaker } from 'src/apis/baking-bad/consts';
import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../selector';

export const useSelectedBakerSelector = (): [BakerInterface, boolean] => {
  const selectedBaker = useSelector(state => state.baking.selectedBaker);
  const isBakerSelected = selectedBaker.address !== emptyBaker.address;

  return [selectedBaker, isBakerSelected];
};

export const useBakersListSelector = () => useSelector(state => state.baking.bakersList.data);

export const useBakerByAddressSelector = (address: string): KnownBaker | undefined => {
  const bakers = useSelector(state => state.baking.bakersList.data);

  return useMemo(() => {
    const knownBaker = KNOWN_BAKERS.find(baker => baker.address === address);

    if (isDefined(knownBaker)) {
      return knownBaker;
    }

    const baker = bakers.find(baker => baker.address === address);

    if (isDefined(baker)) {
      return {
        address: baker.address,
        name: baker.name,
        logo: baker.logo
      };
    }
  }, [bakers]);
};

export const useBakerRewardsListSelector = () => useSelector(state => state.baking.bakerRewardsList.data);
