import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { getThreeRouteLbTokens } from 'src/apis/liquidity-baking';
import { estimateStableswapLpTokenOutput } from 'src/apis/quipuswap-staking';
import { LIQUIDITY_BAKING_PROXY_CONTRACT, MAX_ROUTING_FEE_CHAINS, ROUTING_FEE_ADDRESS, ZERO } from 'src/config/swap';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3LiquidityBakingParams } from 'src/utils/route3.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { convertFarmToken } from 'src/utils/staking.utils';
import {
  calculateRoutingInputAndFee,
  calculateSlippageRatio,
  getLiquidityBakingTransferParams
} from 'src/utils/swap.utils';
import { mutezToTz } from 'src/utils/tezos.util';
import { getTransferParams$, parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { STABLESWAP_REFERRAL } from '../constants';

export const createStakeOperationParams = async (
  farm: SingleFarmResponse,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  account: AccountInterface,
  stakeId: string | undefined,
  slippageTolerancePercentage: number
) => {
  const { publicKeyHash: accountPkh } = account;
  let transferParams: TransferParams[] = [];

  switch (farm.item.type) {
    case FarmPoolTypeEnum.LIQUIDITY_BAKING:
      const { tezToken, tzBTCToken, sirsToken } = await getThreeRouteLbTokens();
      const inputIsTezos = getTokenSlug(asset) === TEZ_TOKEN_SLUG;
      const inputToken = inputIsTezos ? tezToken : tzBTCToken;
      const { swapInputMinusFeeAtomic, routingFeeAtomic } = calculateRoutingInputAndFee(amount);
      const {
        output: rawSwapOutput,
        tzbtcChain,
        xtzChain
      } = await fetchRoute3LiquidityBakingParams({
        fromSymbol: inputToken.symbol,
        toSymbol: 'SIRS',
        amount: mutezToTz(swapInputMinusFeeAtomic, inputToken.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });
      const slippageRatio = calculateSlippageRatio(slippageTolerancePercentage);

      if (!isDefined(rawSwapOutput) || rawSwapOutput === ZERO.toFixed()) {
        throw new Error('Please try depositing a bigger amount');
      }

      const swapOutputAtomic = BigNumber.max(
        new BigNumber(rawSwapOutput).times(slippageRatio).integerValue(BigNumber.ROUND_DOWN),
        1
      );

      const transferDevFeeParams = await firstValueFrom(
        getTransferParams$(
          { address: inputToken.contract ?? '', id: 0 },
          tezos.rpc.getRpcUrl(),
          account,
          ROUTING_FEE_ADDRESS,
          routingFeeAtomic
        )
      );

      const swapContract = await getReadOnlyContract(LIQUIDITY_BAKING_PROXY_CONTRACT, tezos);
      const threeRouteSwapOpParams = await getLiquidityBakingTransferParams(
        inputToken,
        sirsToken,
        swapInputMinusFeeAtomic,
        swapOutputAtomic,
        tzbtcChain.chains,
        xtzChain.chains,
        tezos,
        accountPkh,
        swapContract
      );

      transferParams = [transferDevFeeParams, ...threeRouteSwapOpParams];
      break;
    case FarmPoolTypeEnum.STABLESWAP:
      const { contractAddress: farmAddress, stakedToken } = farm.item;
      const { contractAddress: poolAddress, fa2TokenId: poolId = 0 } = stakedToken;
      const assetSlug = toTokenSlug(asset.address, asset.id);
      const shouldUseWtezToken = assetSlug === TEZ_TOKEN_SLUG;
      const tokenToInvest = shouldUseWtezToken ? WTEZ_TOKEN_METADATA : asset;
      const [farmContract, poolContract] = await Promise.all(
        [farmAddress, poolAddress].map(async address => getReadOnlyContract(address, tezos))
      );

      let convertToWTezParams: TransferParams[] = [];
      if (shouldUseWtezToken) {
        const wTezContract = await getReadOnlyContract(WTEZ_TOKEN_METADATA.address, tezos);
        convertToWTezParams = [
          wTezContract.methods.mint(accountPkh).toTransferParams({ amount: amount.toNumber(), mutez: true })
        ];
      }

      const tokenIndex = farm.item.tokens
        .map(convertFarmToken)
        .findIndex(farmToken => toTokenSlug(farmToken.address, farmToken.id) === assetSlug);
      const michelsonAmounts = new MichelsonMap<number, BigNumber>();
      michelsonAmounts.set(tokenIndex, amount);

      const lpAmount = await estimateStableswapLpTokenOutput(tezos, poolAddress, tokenIndex, amount, poolId);

      const investTransferParams = poolContract.methods
        .invest(
          stakedToken.fa2TokenId,
          lpAmount,
          michelsonAmounts,
          getTransactionTimeoutDate(),
          null,
          STABLESWAP_REFERRAL
        )
        .toTransferParams();

      const depositTransferParams = farmContract.methods
        .deposit(new BigNumber(stakeId ?? 0), lpAmount)
        .toTransferParams();

      const { approve: approveAsset, revoke: revokeAsset } = await getTransferPermissions(
        tezos,
        poolAddress,
        accountPkh,
        {
          standard:
            tokenToInvest.standard === TokenStandardsEnum.Fa2
              ? Route3TokenStandardEnum.fa2
              : Route3TokenStandardEnum.fa12,
          contract: tokenToInvest.address,
          tokenId: tokenToInvest.id.toString()
        },
        amount
      );
      const { approve: approveLp, revoke: revokeLp } = await getTransferPermissions(
        tezos,
        farmAddress,
        accountPkh,
        {
          standard: Route3TokenStandardEnum.fa2,
          contract: poolAddress,
          tokenId: stakedToken.fa2TokenId?.toString() ?? null
        },
        lpAmount
      );

      transferParams = [
        ...approveAsset,
        ...approveLp,
        ...convertToWTezParams,
        investTransferParams,
        depositTransferParams,
        ...revokeLp,
        ...revokeAsset
      ];
      break;
    default:
      throw new Error('Unsupported farm type');
  }

  return transferParams.map(parseTransferParamsToParamsWithKind).flat();
};
