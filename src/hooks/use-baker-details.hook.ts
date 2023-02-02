import { useState, useEffect, useMemo } from 'react';

import { BakerInterface, fetchBaker, buildUnknownBaker } from 'src/apis/baking-bad';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';

export const useBakerDetails = (address: string) => {
  const [bakerDetails, setBakerDetails] = useState<BakerInterface>();

  const allKnownBakers = useBakersListSelector();

  const knownBaker = useMemo(() => allKnownBakers.find(baker => baker.address === address), [allKnownBakers, address]);

  useEffect(() => {
    if (bakerDetails) {
      return;
    }

    if (knownBaker) {
      return void setBakerDetails(knownBaker);
    }

    if (allKnownBakers.length) {
      fetchBaker(address).then(baker => setBakerDetails(baker || buildUnknownBaker(address)));
    }
  }, [allKnownBakers, knownBaker]);

  return bakerDetails;
};
