import { TokenBalanceInterface } from './token-balance.interface';

export interface GetAccountTokenBalancesResponseInterface {
  balances: TokenBalanceInterface[];
  total: number;
}
