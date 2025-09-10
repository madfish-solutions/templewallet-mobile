import { useSelector } from '../selector';

export const useSelectedBakerSelector = () => {
  const selectedBaker = useSelector(state => state.baking.selectedBaker);

  // Checking address, because previously 'Empty baker' with `address: ''` was set in store.
  return selectedBaker?.address ? selectedBaker : null;
};

export const useBakersListSelector = () => useSelector(state => state.baking.bakersList.data);
