import { TokenBalanceInterface } from '../token/interfaces/token-balance.interface';

export interface GetAccountTokenBalancesResponseInterface {
  balances: TokenBalanceInterface[];
  total: number;
}
