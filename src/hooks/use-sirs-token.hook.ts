import { useTokenSelector } from '../store/wallet/wallet-selectors';
import { LIQUIDITY_BAKING_LP_SLUG } from '../token/data/token-slugs';
import { isDefined } from '../utils/is-defined';

export const useSirsToken = () => {
  const sirsToken = useTokenSelector(LIQUIDITY_BAKING_LP_SLUG);

  const isSirsBalance = isDefined(sirsToken) && Number(sirsToken.balance) > 0;

  return { isSirsBalance, sirsToken };
};
