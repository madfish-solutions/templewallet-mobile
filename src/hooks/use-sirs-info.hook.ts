import { useTokenSelector } from '../store/wallet/wallet-selectors';
import { KNOWN_TOKENS_SLUGS } from '../token/data/token-slugs';
import { isDefined } from '../utils/is-defined';

export const useSirsInfo = () => {
  const token = useTokenSelector(KNOWN_TOKENS_SLUGS.SIRS);

  const isPositiveBalance = isDefined(token) && Number(token.balance) > 0;

  return { isPositiveBalance, token };
};
