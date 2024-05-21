import { contracts, AssetDefinition, UnifiedStakeExtendedItem } from '@temple-wallet/youves-sdk';
import { BigNumber } from 'bignumber.js';
import { catchError, firstValueFrom, forkJoin, from, map, Observable, of } from 'rxjs';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ExchangeRateRecord } from 'src/store/currency/currency-state';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { getLastElement } from 'src/utils/array.utils';
import { getFirstAccountActivityTime } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { tzktUrl } from 'src/utils/linking';
import { fractionToPercentage } from 'src/utils/percentage.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { INITIAL_APR_VALUE } from './constants';
import { SavingsPoolStorage } from './types';
import { createEngineMemoized, createUnifiedSavings, createUnifiedStaking, toEarnOpportunityToken } from './utils';

export const getYOUTokenApr$ = (
  assetToUsdExchangeRate: BigNumber,
  governanceToUsdExchangeRate: BigNumber,
  rpcUrl: string
): Observable<number> => {
  const unifiedStaking = createUnifiedStaking(rpcUrl);

  return from(unifiedStaking.getAPR(assetToUsdExchangeRate, governanceToUsdExchangeRate)).pipe(
    map(value => fractionToPercentage(value).toNumber()),
    catchError(() => {
      createUnifiedStaking.delete(rpcUrl);

      return of(INITIAL_APR_VALUE);
    })
  );
};

export const getYouvesTokenApr$ = (token: AssetDefinition, rpcUrl: string): Observable<number> => {
  const youves = createEngineMemoized(rpcUrl, token);

  return from(youves.getSavingsPoolV3YearlyInterestRate()).pipe(
    map(value => fractionToPercentage(value).toNumber()),
    catchError(() => {
      createEngineMemoized.delete(rpcUrl, token);

      return of(INITIAL_APR_VALUE);
    })
  );
};

const getYOUTokenSavingItem = async (
  youToUsdExchangeRate: BigNumber,
  rpcUrl: string
): Promise<SavingsItem | undefined> => {
  try {
    const tezos = createReadOnlyTezosToolkit(rpcUrl);
    const unifiedStaking = createUnifiedStaking(rpcUrl);
    const apr = await firstValueFrom(getYOUTokenApr$(youToUsdExchangeRate, youToUsdExchangeRate, rpcUrl));
    const savingsContract = await getReadOnlyContract(unifiedStaking.stakingContract, tezos);
    const savingsStorage = await savingsContract.storage<SavingsPoolStorage>();
    const stakedToken = toEarnOpportunityToken(unifiedStaking.stakeToken);
    const tvlInStakedTokenAtoms = mutezToTz(
      savingsStorage.total_stake.times(savingsStorage.disc_factor),
      unifiedStaking.stakeToken.decimals
    ).integerValue(BigNumber.ROUND_DOWN);
    const tvlInStakedToken = mutezToTz(tvlInStakedTokenAtoms, unifiedStaking.stakeToken.decimals);
    const firstActivityTime = await getFirstAccountActivityTime(unifiedStaking.stakingContract);

    return {
      id: unifiedStaking.stakeToken.id,
      contractAddress: unifiedStaking.stakingContract,
      apr: apr.toString(),
      depositExchangeRate: youToUsdExchangeRate.toFixed(),
      depositTokenUrl: tzktUrl(rpcUrl, unifiedStaking.stakeToken.contractAddress),
      discFactor: savingsStorage.disc_factor.toFixed(),
      earnExchangeRate: youToUsdExchangeRate.toFixed(),
      vestingPeriodSeconds: savingsStorage.max_release_period.toFixed(),
      stakeUrl: tzktUrl(rpcUrl, unifiedStaking.stakingContract),
      stakedToken,
      tokens: [stakedToken],
      rewardToken: stakedToken,
      staked: tvlInStakedTokenAtoms.toFixed(),
      tvlInUsd: tvlInStakedToken.times(youToUsdExchangeRate).toFixed(),
      tvlInStakedToken: tvlInStakedToken.toFixed(),
      type: EarnOpportunityTypeEnum.YOUVES_STAKING,
      firstActivityTime
    };
  } catch (error) {
    createUnifiedStaking.delete(rpcUrl);
    console.error(error);

    return undefined;
  }
};

const getSavingsItemByAssetDefinition = async (
  assetDefinition: AssetDefinition,
  tokenUsdExchangeRates: ExchangeRateRecord,
  rpcUrl: string
): Promise<SavingsItem | undefined> => {
  try {
    const tezos = createReadOnlyTezosToolkit(rpcUrl);
    const { id, token, SAVINGS_V3_POOL_ADDRESS } = assetDefinition;
    const { decimals: tokenDecimals, contractAddress: tokenAddress, tokenId } = token;
    const apr = await firstValueFrom(getYouvesTokenApr$(assetDefinition, rpcUrl));
    const savingsContract = await getReadOnlyContract(SAVINGS_V3_POOL_ADDRESS, tezos);
    const savingsStorage = await savingsContract.storage<SavingsPoolStorage>();
    const tvlInStakedTokenAtoms = mutezToTz(
      savingsStorage.total_stake.times(savingsStorage.disc_factor),
      tokenDecimals
    ).integerValue(BigNumber.ROUND_DOWN);
    const tvlInStakedToken = mutezToTz(tvlInStakedTokenAtoms, tokenDecimals);

    const stakedToken = toEarnOpportunityToken(token);
    const tokenExchangeRate = tokenUsdExchangeRates[toTokenSlug(tokenAddress, tokenId)]?.toString() ?? null;
    const firstActivityTime = await getFirstAccountActivityTime(SAVINGS_V3_POOL_ADDRESS);

    return {
      id,
      contractAddress: SAVINGS_V3_POOL_ADDRESS,
      apr: apr.toString(),
      depositExchangeRate: tokenExchangeRate,
      depositTokenUrl: tzktUrl(rpcUrl, tokenAddress),
      discFactor: savingsStorage.disc_factor.toFixed(),
      earnExchangeRate: tokenExchangeRate,
      vestingPeriodSeconds: savingsStorage.max_release_period.toFixed(),
      stakeUrl: tzktUrl(rpcUrl, SAVINGS_V3_POOL_ADDRESS),
      stakedToken,
      tokens: [stakedToken],
      rewardToken: stakedToken,
      staked: tvlInStakedTokenAtoms.toFixed(),
      tvlInUsd: isDefined(tokenExchangeRate) ? tvlInStakedToken.times(tokenExchangeRate).toFixed() : null,
      tvlInStakedToken: tvlInStakedToken.toFixed(),
      type: EarnOpportunityTypeEnum.YOUVES_SAVING,
      firstActivityTime
    };
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

export const getYouvesSavingsItems$ = (tokenUsdExchangeRates: ExchangeRateRecord, rpcUrl: string) =>
  forkJoin([
    getYOUTokenSavingItem(new BigNumber(tokenUsdExchangeRates[KNOWN_TOKENS_SLUGS.YOU] ?? 1), rpcUrl),
    ...contracts.mainnet
      .filter(({ SAVINGS_V3_POOL_ADDRESS, token }) => isString(SAVINGS_V3_POOL_ADDRESS) && token.id !== 'uXTZ')
      .map(assetDefinition => getSavingsItemByAssetDefinition(assetDefinition, tokenUsdExchangeRates, rpcUrl))
  ]).pipe(map(items => items.filter(isDefined)));

export const getUserStake = async (
  account: AccountInterface,
  stakingOrSavingId: string,
  type: EarnOpportunityTypeEnum,
  rpcUrl: string
): Promise<UserStakeValueInterface | null> => {
  const assetDefinition = contracts.mainnet.find(({ id }) => id === stakingOrSavingId);
  let lastStake: UnifiedStakeExtendedItem | undefined;

  switch (type) {
    case EarnOpportunityTypeEnum.YOUVES_STAKING:
      try {
        const unifiedStaking = createUnifiedStaking(rpcUrl, account);
        lastStake = getLastElement(await unifiedStaking.getOwnStakesWithExtraInfo());
      } catch (e) {
        createUnifiedStaking.delete(rpcUrl, account);

        throw e;
      }
      break;
    case EarnOpportunityTypeEnum.YOUVES_SAVING:
      if (!isDefined(assetDefinition)) {
        throw new Error(`Unknown saving with id ${stakingOrSavingId}`);
      }

      try {
        const savings = createUnifiedSavings(rpcUrl, assetDefinition, account);
        lastStake = getLastElement(await savings.getOwnStakesWithExtraInfo());
      } catch (e) {
        createUnifiedSavings.delete(rpcUrl, assetDefinition, account);

        throw e;
      }
      break;
    default:
      throw new Error('Unsupported savings type');
  }

  return lastStake
    ? {
        lastStakeId: lastStake.id.toFixed(),
        depositAmountAtomic: lastStake.token_amount.toFixed(),
        claimableRewards: lastStake.rewardNow.toFixed(),
        fullReward: lastStake.rewardTotal.toFixed(),
        rewardsDueDate: new Date(lastStake.endTimestamp).getTime()
      }
    : null;
};
