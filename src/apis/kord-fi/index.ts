import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { Observable, catchError, from, map, of } from 'rxjs';

import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { EarnOpportunityToken } from 'src/interfaces/earn-opportunity/earn-opportunity-token.interface';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ExchangeRateRecord } from 'src/store/currency/currency-state';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { toEarnOpportunityToken } from 'src/utils/earn.utils';
import { tzktUrl } from 'src/utils/linking';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';
import { tzToMutez } from 'src/utils/tezos.util';

import { KordFiLendStats, KordFiStatsResponse, KordFiUserDepositsResponse } from './types';

const kordFiApi = axios.create({
  baseURL: 'https://back-llb-beta.kord.fi'
});

export const KORDFI_TEZOS_CONTRACT_ADDRESS = 'KT19qWdPBRtkWrsQnDvVfsqJgJB19keBhhMX';
const TZBTC_CONTRACT_ADDRESS = 'KT1WL6sHt8syFT2ts7NCmb5gPcS2tyfRxSyi';
const TEZOS_TOKEN: EarnOpportunityToken = toEarnOpportunityToken(
  TEZ_TOKEN_METADATA,
  EarnOpportunityTokenStandardEnum.Fa12,
  true,
  ['tez']
);
const TZBTC_TOKEN: EarnOpportunityToken = toEarnOpportunityToken(
  TZBTC_TOKEN_METADATA,
  EarnOpportunityTokenStandardEnum.Fa12,
  true,
  ['tzbtc']
);

const getKordFiStats$ = (): Observable<KordFiLendStats> =>
  from(kordFiApi.get<KordFiStatsResponse>('/llb-api/lend-stats/')).pipe(
    map(
      ({
        data: {
          xtz_apr,
          xtz_total_supply_usd,
          xtz_total_borrow_usd,
          tzbtc_apr,
          tzbtc_total_supply_usd,
          tzbtc_total_borrow_usd,
          tvl_usd
        }
      }) => ({
        xtzApr: xtz_apr,
        xtzTotalSupplyUsd: xtz_total_supply_usd,
        xtzTotalBorrowUsd: xtz_total_borrow_usd,
        tzbtcApr: tzbtc_apr,
        tzbtcTotalSupplyUsd: tzbtc_total_supply_usd,
        tzbtcTotalBorrowUsd: tzbtc_total_borrow_usd,
        tvlUsd: tvl_usd
      })
    )
  );

export const getKordFiUserDeposits$ = (address: string): Observable<{ [key: string]: UserStakeValueInterface }> =>
  from(kordFiApi.post<KordFiUserDepositsResponse>('/llb-api/user-deposits/', { address })).pipe(
    map(({ data: { xtz_deposit, tzbtc_deposit } }) => {
      const tezosDepositAmountAtomic = tzToMutez(new BigNumber(xtz_deposit), TEZ_TOKEN_METADATA.decimals).toFixed();
      const tezosStake: UserStakeValueInterface = {
        lastStakeId: '0',
        depositAmountAtomic: tezosDepositAmountAtomic,
        claimableRewards: tezosDepositAmountAtomic,
        fullReward: tezosDepositAmountAtomic,
        rewardsDueDate: 0
      };

      const tzbtcDepositAmountAtomic = tzToMutez(new BigNumber(tzbtc_deposit), TZBTC_TOKEN_METADATA.decimals).toFixed();
      const tzbtcStake: UserStakeValueInterface = {
        lastStakeId: '0',
        depositAmountAtomic: tzbtcDepositAmountAtomic,
        claimableRewards: tzbtcDepositAmountAtomic,
        fullReward: tzbtcDepositAmountAtomic,
        rewardsDueDate: 0
      };

      return {
        [KORDFI_TEZOS_CONTRACT_ADDRESS]: tezosStake,
        [TZBTC_CONTRACT_ADDRESS]: tzbtcStake
      };
    }),
    catchError(error => {
      console.error('Error getting Kord.Fi user deposits: ', error);

      return of({});
    })
  );

export const getKordFiItems$ = (rates: ExchangeRateRecord): Observable<Array<SavingsItem>> =>
  getKordFiStats$().pipe(
    map(kordFiStats => {
      const tezExchangeRate = rates[TEZ_TOKEN_SLUG] ?? 1;
      const tzbtcExchangeRate = rates[getTokenSlug(TZBTC_TOKEN_METADATA)] ?? 1;

      const tezosInfo: SavingsItem = {
        id: '0',
        contractAddress: KORDFI_TEZOS_CONTRACT_ADDRESS,
        apr: kordFiStats.xtzApr?.toString(),
        depositExchangeRate: tezExchangeRate.toString(),
        depositTokenUrl: '',
        discFactor: '0',
        earnExchangeRate: tezExchangeRate.toString(),
        vestingPeriodSeconds: '0',
        stakeUrl: tzktUrl(TEMPLE_RPC.url, KORDFI_TEZOS_CONTRACT_ADDRESS),
        stakedToken: TEZOS_TOKEN,
        tokens: [TEZOS_TOKEN],
        rewardToken: TEZOS_TOKEN,
        staked: new BigNumber(kordFiStats.xtzTotalSupplyUsd / tezExchangeRate)?.toFixed(),
        tvlInUsd: kordFiStats.xtzTotalSupplyUsd?.toFixed(),
        tvlInStakedToken: kordFiStats.xtzTotalSupplyUsd?.toFixed(),
        type: EarnOpportunityTypeEnum.KORD_FI_SAVING,
        firstActivityTime: '0'
      };
      const tzbtcInfo: SavingsItem = {
        id: '0',
        contractAddress: TZBTC_CONTRACT_ADDRESS,
        apr: kordFiStats.tzbtcApr?.toString(),
        depositExchangeRate: tzbtcExchangeRate.toString(),
        depositTokenUrl: tzktUrl(TEMPLE_RPC.url, TZBTC_TOKEN_METADATA.address),
        discFactor: '0',
        earnExchangeRate: tzbtcExchangeRate.toString(),
        vestingPeriodSeconds: '0',
        stakeUrl: tzktUrl(TEMPLE_RPC.url, TZBTC_CONTRACT_ADDRESS),
        stakedToken: TZBTC_TOKEN,
        tokens: [TZBTC_TOKEN],
        rewardToken: TZBTC_TOKEN,
        staked: (kordFiStats.tzbtcTotalSupplyUsd / tzbtcExchangeRate)?.toFixed(),
        tvlInUsd: kordFiStats.tzbtcTotalSupplyUsd?.toFixed(),
        tvlInStakedToken: kordFiStats.tzbtcTotalSupplyUsd?.toFixed(),
        type: EarnOpportunityTypeEnum.KORD_FI_SAVING,
        firstActivityTime: '0'
      };

      return [tezosInfo, tzbtcInfo];
    })
  );
