import { useTokenSelector } from '../store/wallet/wallet-selectors';
import { SIRS_SLUG } from '../token/data/token-slugs';
import { isDefined } from '../utils/is-defined';

export const useSirsInfo = () => {
  const token = useTokenSelector(SIRS_SLUG);

  const isPositiveBalance = isDefined(token) && Number(token.balance) > 0;

  return { isPositiveBalance, token };
};
