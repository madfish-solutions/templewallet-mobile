import { useSelector } from '../selector';

export const useUsdToTokenRates = () => useSelector(({ currency }) => currency.usdToTokenRates.data);
