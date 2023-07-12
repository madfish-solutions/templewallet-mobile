import { BigNumber } from 'bignumber.js';
import { catchError, firstValueFrom, forkJoin, from, map, Observable, of } from 'rxjs';
import { contracts, AssetDefinition } from 'youves-sdk';
import { UnifiedStakeExtendedItem } from 'youves-sdk/dist/staking/unified-staking';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { ExchangeRateRecord } from 'src/store/currency/currency-state';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { getLastElement } from 'src/utils/array.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { tzktUrl } from 'src/utils/linking.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { INITIAL_ARP_VALUE, PERCENTAGE_MULTIPLIER } from './constants';
import { SavingsPoolStorage } from './types';
import {
  createEngineCache,
  createEngineMemoized,
  createUnifiedSavings,
  createUnifiedSavingsCache,
  createUnifiedStaking,
  createUnifiedStakingCache,
  fallbackTezosToolkit,
  toEarnOpportunityToken
} from './utils';

export const getYOUTokenApr$ = (
  assetToUsdExchangeRate: BigNumber,
  governanceToUsdExchangeRate: BigNumber
): Observable<number> => {
  const unifiedStaking = createUnifiedStaking();

  return from(unifiedStaking.getAPR(assetToUsdExchangeRate, governanceToUsdExchangeRate)).pipe(
    map(value => Number(value.multipliedBy(PERCENTAGE_MULTIPLIER))),
    catchError(() => {
      createUnifiedStakingCache.deleteByArgs(undefined);

      return of(INITIAL_ARP_VALUE);
    })
  );
};

export const getYouvesTokenApr$ = (token: AssetDefinition): Observable<number> => {
  const youves = createEngineMemoized(token);

  return from(youves.getSavingsPoolV3YearlyInterestRate()).pipe(
    map(value => Number(value.multipliedBy(PERCENTAGE_MULTIPLIER))),
    catchError(() => {
      createEngineCache.deleteByArgs(token, undefined);

      return of(INITIAL_ARP_VALUE);
    })
  );
};

const getYOUTokenSavingItem = async (youToUsdExchangeRate: BigNumber): Promise<SavingsItem | undefined> => {
  try {
    const unifiedStaking = createUnifiedStaking();
    const apr = await firstValueFrom(getYOUTokenApr$(youToUsdExchangeRate, youToUsdExchangeRate));
    const savingsContract = await getReadOnlyContract(unifiedStaking.stakingContract, fallbackTezosToolkit);
    const savingsStorage = await savingsContract.storage<SavingsPoolStorage>();
    const stakedToken = toEarnOpportunityToken(unifiedStaking.stakeToken);
    const tvlInStakedTokenAtoms = mutezToTz(
      savingsStorage.total_stake.times(savingsStorage.disc_factor),
      unifiedStaking.stakeToken.decimals
    ).integerValue(BigNumber.ROUND_DOWN);
    const tvlInStakedToken = mutezToTz(tvlInStakedTokenAtoms, unifiedStaking.stakeToken.decimals);

    return {
      id: unifiedStaking.stakeToken.id,
      contractAddress: unifiedStaking.stakingContract,
      apr: apr.toString(),
      depositExchangeRate: youToUsdExchangeRate.toFixed(),
      depositTokenUrl: tzktUrl(fallbackTezosToolkit.rpc.getRpcUrl(), unifiedStaking.stakeToken.contractAddress),
      discFactor: savingsStorage.disc_factor.toFixed(),
      earnExchangeRate: youToUsdExchangeRate.toFixed(),
      vestingPeriodSeconds: savingsStorage.max_release_period.toFixed(),
      stakeUrl: tzktUrl(fallbackTezosToolkit.rpc.getRpcUrl(), unifiedStaking.stakingContract),
      stakedToken,
      tokens: [stakedToken],
      rewardToken: stakedToken,
      staked: tvlInStakedTokenAtoms.toFixed(),
      tvlInUsd: tvlInStakedToken.times(youToUsdExchangeRate).toFixed(),
      tvlInStakedToken: tvlInStakedToken.toFixed(),
      type: EarnOpportunityTypeEnum.YOUVES_STAKING
    };
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

export const getYouvesSavingsItems$ = (tokenUsdExchangeRates: ExchangeRateRecord) =>
  forkJoin([
    getYOUTokenSavingItem(new BigNumber(tokenUsdExchangeRates[KNOWN_TOKENS_SLUGS.YOU] ?? 1)),
    ...contracts.mainnet
      .filter(({ SAVINGS_V3_POOL_ADDRESS }) => isString(SAVINGS_V3_POOL_ADDRESS))
      .map<Promise<SavingsItem | undefined>>(async assetDefinition => {
        try {
          const { id, token, SAVINGS_V3_POOL_ADDRESS } = assetDefinition;
          const { decimals: tokenDecimals, contractAddress: tokenAddress, tokenId } = token;
          const apr = await firstValueFrom(getYouvesTokenApr$(assetDefinition));
          const savingsContract = await getReadOnlyContract(SAVINGS_V3_POOL_ADDRESS, fallbackTezosToolkit);
          const savingsStorage = await savingsContract.storage<SavingsPoolStorage>();
          const tvlInStakedTokenAtoms = mutezToTz(
            savingsStorage.total_stake.times(savingsStorage.disc_factor),
            tokenDecimals
          ).integerValue(BigNumber.ROUND_DOWN);
          const tvlInStakedToken = mutezToTz(tvlInStakedTokenAtoms, tokenDecimals);

          const stakedToken = toEarnOpportunityToken(token);
          const tokenExchangeRate = tokenUsdExchangeRates[toTokenSlug(tokenAddress, tokenId)]?.toString() ?? null;

          return {
            id,
            contractAddress: SAVINGS_V3_POOL_ADDRESS,
            apr: apr.toString(),
            depositExchangeRate: tokenExchangeRate,
            depositTokenUrl: tzktUrl(fallbackTezosToolkit.rpc.getRpcUrl(), tokenAddress),
            discFactor: savingsStorage.disc_factor.toFixed(),
            earnExchangeRate: tokenExchangeRate,
            vestingPeriodSeconds: savingsStorage.max_release_period.toFixed(),
            stakeUrl: tzktUrl(fallbackTezosToolkit.rpc.getRpcUrl(), SAVINGS_V3_POOL_ADDRESS),
            stakedToken,
            tokens: [stakedToken],
            rewardToken: stakedToken,
            staked: tvlInStakedTokenAtoms.toFixed(),
            tvlInUsd: isDefined(tokenExchangeRate) ? tvlInStakedToken.times(tokenExchangeRate).toFixed() : null,
            tvlInStakedToken: tvlInStakedToken.toFixed(),
            type: EarnOpportunityTypeEnum.YOUVES_SAVING
          };
        } catch (error) {
          console.error(error);

          return undefined;
        }
      })
  ]).pipe(map(items => items.filter(isDefined)));

export const getUserStake = async (
  account: AccountInterface,
  stakingOrSavingId: string,
  type: EarnOpportunityTypeEnum
) => {
  const assetDefinition = contracts.mainnet.find(({ id }) => id === stakingOrSavingId);
  let lastStake: UnifiedStakeExtendedItem | undefined;

  switch (type) {
    case EarnOpportunityTypeEnum.YOUVES_STAKING:
      try {
        const unifiedStaking = createUnifiedStaking(account);
        lastStake = getLastElement(await unifiedStaking.getOwnStakesWithExtraInfo());
      } catch (e) {
        createUnifiedStakingCache.deleteByArgs(account);

        throw e;
      }
      break;
    case EarnOpportunityTypeEnum.YOUVES_SAVING:
      if (!isDefined(assetDefinition)) {
        throw new Error(`Unknown saving with id ${stakingOrSavingId}`);
      }

      try {
        const savings = createUnifiedSavings(assetDefinition, account);
        lastStake = getLastElement(await savings.getOwnStakesWithExtraInfo());
      } catch (e) {
        createUnifiedSavingsCache.deleteByArgs(assetDefinition, account);

        throw e;
      }
      break;
    default:
      throw new Error('Unsupported savings type');
  }

  return (
    lastStake && {
      lastStakeId: lastStake.id.toFixed(),
      depositAmountAtomic: lastStake.token_amount.toFixed(),
      claimableRewards: lastStake.rewardNow.toFixed(),
      fullReward: lastStake.rewardTotal.toFixed(),
      rewardsDueDate: new Date(lastStake.endTimestamp).getTime()
    }
  );
};
