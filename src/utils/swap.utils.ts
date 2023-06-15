import { ContractAbstraction, ContractProvider, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { APP_ID, ROUTE3_CONTRACT, ROUTING_FEE_RATIO, ZERO } from 'src/config/swap';
import { Route3Chain, Route3Token } from 'src/interfaces/route3.interface';

import { mapToRoute3ExecuteHops } from './route3.util';
import { getTransferPermissions } from './transfer-permissions.util';

export const calculateRoutingInputAndFee = (inputAmount: BigNumber | undefined) => {
  const swapInputAtomic = (inputAmount ?? ZERO).integerValue(BigNumber.ROUND_DOWN);
  const swapInputMinusFeeAtomic = swapInputAtomic.times(ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_DOWN);
  const routingFeeAtomic = swapInputAtomic.minus(swapInputMinusFeeAtomic);

  return {
    swapInputMinusFeeAtomic,
    routingFeeAtomic
  };
};

export const getRoutingFeeTransferParams = async (
  token: Route3Token,
  feeAmountAtomic: BigNumber,
  senderPublicKeyHash: string,
  routingFeeAddress: string,
  tezos: TezosToolkit
) => {
  if (token.contract === null) {
    return [
      {
        amount: feeAmountAtomic.toNumber(),
        to: routingFeeAddress,
        mutez: true
      }
    ];
  }

  const assetContract = await tezos.wallet.at(token.contract);

  if (token.standard === 'fa12') {
    return [
      assetContract.methods
        .transfer(senderPublicKeyHash, routingFeeAddress, feeAmountAtomic.toNumber())
        .toTransferParams({ mutez: true })
    ];
  }
  if (token.standard === 'fa2') {
    return [
      assetContract.methods
        .transfer([
          {
            from_: senderPublicKeyHash,
            txs: [
              {
                to_: routingFeeAddress,
                token_id: token.tokenId,
                amount: feeAmountAtomic.toNumber()
              }
            ]
          }
        ])
        .toTransferParams({ mutez: true })
    ];
  }

  return [];
};

export const getSwapTransferParams = async (
  fromRoute3Token: Route3Token,
  toRoute3Token: Route3Token,
  inputAmountAtomic: BigNumber,
  minimumReceivedAtomic: BigNumber,
  chains: Array<Route3Chain>,
  tezos: TezosToolkit,
  accountPkh: string,
  swapContract: ContractAbstraction<ContractProvider>
) => {
  const resultParams: Array<TransferParams> = [];

  const swapOpParams = swapContract.methods.execute(
    fromRoute3Token.id,
    toRoute3Token.id,
    minimumReceivedAtomic,
    accountPkh,
    mapToRoute3ExecuteHops(chains, fromRoute3Token.decimals),
    APP_ID
  );

  if (fromRoute3Token.symbol.toLowerCase() === 'xtz') {
    resultParams.push(
      swapOpParams.toTransferParams({
        amount: inputAmountAtomic.toNumber(),
        mutez: true
      })
    );
  } else {
    resultParams.push(swapOpParams.toTransferParams());
  }

  const { approve, revoke } = await getTransferPermissions(
    tezos,
    ROUTE3_CONTRACT,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic
  );

  resultParams.unshift(...approve);
  resultParams.push(...revoke);

  return resultParams;
};

export const calculateSlippageRatio = (slippageTolerancePercentage: number) =>
  (100 - slippageTolerancePercentage) / 100;
