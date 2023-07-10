import { useSelector } from '../selector';

export const useSavingsItemsLoadingSelector = () => useSelector(({ savings }) => savings.allSavingsItems.isLoading);

export const useSavingsItemsSelector = () => useSelector(({ savings }) => savings.allSavingsItems.data);

export const useSavingsStakesSelector = () => useSelector(({ savings }) => savings.stakes.data);
