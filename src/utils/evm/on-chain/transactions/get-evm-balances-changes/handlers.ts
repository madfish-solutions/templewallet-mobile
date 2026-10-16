import BigNumber from 'bignumber.js';
import { isAddressEqual, SimulateContractReturnType } from 'viem';

import { toEvmAssetSlug } from 'src/utils/from-token-slug';

import {
  erc1155BurnAbi,
  erc1155BurnBatchAbi,
  erc1155MintAbi,
  erc1155MintBatchAbi,
  erc1155SafeBatchTransferFromAbi,
  erc1155SafeTransferFromAbi
} from '../../abi/erc1155.abi';
import {
  erc20BurnAbi,
  erc20BurnFromAbi,
  erc20MintAbi,
  erc20TransferAbi,
  erc20TransferFromAbi
} from '../../abi/erc20.abi';
import {
  erc721BurnAbi,
  erc721MintAbi,
  erc721SafeMintAbi,
  erc721SafeMintWithDataAbi,
  erc721SafeTransferFromNonpayableAbi,
  erc721SafeTransferFromPayableAbi,
  erc721TransferFromAbi
} from '../../abi/erc721.abi';
import { EvmAssetStandard } from '../../types';
import {
  AssetsAmounts,
  makeAbiFunctionHandler,
  ParseCallback,
  targetIsErc20,
  targetIsErc721,
  toBigNumber,
  TxAbiFragment
} from '../helpers';

type AssetsAmountsParseCallback<AbiFragment extends TxAbiFragment> = ParseCallback<AbiFragment, AssetsAmounts>;

const withOperationSimulation = async <AbiFragment extends TxAbiFragment>(
  simulateOperation: () => Promise<SimulateContractReturnType<[AbiFragment]>['result']>,
  onSuccess: (result: SimulateContractReturnType<[AbiFragment]>['result']) => AssetsAmounts
) => {
  try {
    return onSuccess(await simulateOperation());
  } catch (e) {
    console.error(e);

    return {};
  }
};

const onErc721TransferParse: AssetsAmountsParseCallback<
  typeof erc721SafeTransferFromPayableAbi | typeof erc721SafeTransferFromNonpayableAbi | typeof erc721TransferFromAbi
> = async ({ args: [tokensSender, recipient, tokenId], sender, to }) => {
  const isSendingOwnTokens = isAddressEqual(tokensSender, sender);

  if (isAddressEqual(recipient, tokensSender) || (!isSendingOwnTokens && !isAddressEqual(recipient, sender))) {
    return {};
  }

  return {
    [toEvmAssetSlug(to, tokenId.toString())]: {
      atomicAmount: new BigNumber(isSendingOwnTokens ? -1 : 1),
      standard: EvmAssetStandard.ERC721,
      receiver: recipient
    }
  };
};

const onErc721MintParse: AssetsAmountsParseCallback<
  typeof erc721MintAbi | typeof erc721SafeMintAbi | typeof erc721SafeMintWithDataAbi
> = async ({ args: [recipient], simulateOperation, sender, to }) =>
  isAddressEqual(recipient, sender)
    ? await withOperationSimulation<typeof erc721MintAbi | typeof erc721SafeMintAbi>(simulateOperation, tokenId => ({
        [toEvmAssetSlug(to, tokenId.toString())]: { atomicAmount: new BigNumber(1), standard: EvmAssetStandard.ERC721 }
      }))
    : {};

const onErc1155TransfersParse: AssetsAmountsParseCallback<typeof erc1155SafeBatchTransferFromAbi> = async ({
  args: [tokensSender, recipient, ids, values],
  sender,
  to
}) => {
  const isSendingOwnTokens = isAddressEqual(tokensSender, sender);

  if (isAddressEqual(recipient, tokensSender) || (!isSendingOwnTokens && !isAddressEqual(recipient, sender))) {
    return {};
  }

  return Object.fromEntries(
    ids.map((id, i) => [
      toEvmAssetSlug(to, id.toString()),
      {
        atomicAmount: toBigNumber(isSendingOwnTokens ? -values[i] : values[i]),
        standard: EvmAssetStandard.ERC1155,
        receiver: recipient
      }
    ])
  );
};

const onErc1155MintsParse: AssetsAmountsParseCallback<typeof erc1155MintBatchAbi> = async ({
  args: [recipient, ids, values],
  sender,
  to
}) =>
  isAddressEqual(recipient, sender)
    ? Object.fromEntries(
        ids.map((id, i) => [
          toEvmAssetSlug(to, id.toString()),
          { atomicAmount: toBigNumber(values[i]), standard: EvmAssetStandard.ERC1155 }
        ])
      )
    : {};

const onErc1155BurnsParse: AssetsAmountsParseCallback<typeof erc1155BurnBatchAbi> = async ({
  args: [tokensSender, ids, values],
  sender,
  to
}) =>
  isAddressEqual(tokensSender, sender)
    ? Object.fromEntries(
        ids.map((id, i) => [
          toEvmAssetSlug(to, id.toString()),
          { atomicAmount: toBigNumber(-values[i]), standard: EvmAssetStandard.ERC1155 }
        ])
      )
    : {};

/**
 * A list of functions that try to estimate tokens balances changes assuming that a user themselves sent a transaction.
 * Each of them returns `null` if the transaction is not related to the function, or a record of balances changes otherwise.
 */
export const knownOperationsHandlers = [
  makeAbiFunctionHandler(
    erc20MintAbi,
    async ({ args: [account, value], sender, to }) =>
      isAddressEqual(account, sender)
        ? { [toEvmAssetSlug(to)]: { atomicAmount: toBigNumber(value), standard: EvmAssetStandard.ERC20 } }
        : {},
    targetIsErc20
  ),
  makeAbiFunctionHandler(
    erc20BurnAbi,
    async ({ args: [value], to }) => ({
      [toEvmAssetSlug(to)]: { atomicAmount: toBigNumber(-value), standard: EvmAssetStandard.ERC20 }
    }),
    targetIsErc20
  ),
  makeAbiFunctionHandler(
    erc20BurnFromAbi,
    async ({ args: [account, value], sender, to }) =>
      isAddressEqual(account, sender)
        ? { [toEvmAssetSlug(to)]: { atomicAmount: toBigNumber(-value), standard: EvmAssetStandard.ERC20 } }
        : {},
    targetIsErc20
  ),
  makeAbiFunctionHandler(
    erc20TransferAbi,
    async ({ args: [recipient, amount], sender, to }) =>
      isAddressEqual(recipient, sender)
        ? {}
        : {
            [toEvmAssetSlug(to)]: {
              atomicAmount: toBigNumber(-amount),
              standard: EvmAssetStandard.ERC20,
              receiver: recipient
            }
          },
    targetIsErc20
  ),
  makeAbiFunctionHandler(
    erc20TransferFromAbi,
    async ({ args: [tokensSender, recipient, amount], sender, to }) => {
      const isSendingOwnTokens = isAddressEqual(tokensSender, sender);

      return isAddressEqual(recipient, tokensSender) || (!isSendingOwnTokens && !isAddressEqual(recipient, sender))
        ? {}
        : {
            [toEvmAssetSlug(to)]: {
              atomicAmount: toBigNumber(isSendingOwnTokens ? -amount : amount),
              standard: EvmAssetStandard.ERC20,
              receiver: recipient
            }
          };
    },
    targetIsErc20
  ),
  makeAbiFunctionHandler(erc721SafeTransferFromPayableAbi, onErc721TransferParse, targetIsErc721),
  makeAbiFunctionHandler(erc721SafeTransferFromNonpayableAbi, onErc721TransferParse, targetIsErc721),
  makeAbiFunctionHandler(erc721TransferFromAbi, onErc721TransferParse, targetIsErc721),
  makeAbiFunctionHandler(erc721MintAbi, onErc721MintParse, targetIsErc721),
  makeAbiFunctionHandler(erc721SafeMintAbi, onErc721MintParse, targetIsErc721),
  makeAbiFunctionHandler(erc721SafeMintWithDataAbi, onErc721MintParse, targetIsErc721),
  makeAbiFunctionHandler(
    erc721BurnAbi,
    async ({ args: [tokenId], to }) => ({
      [toEvmAssetSlug(to, tokenId.toString())]: { atomicAmount: new BigNumber(-1), standard: EvmAssetStandard.ERC721 }
    }),
    targetIsErc721
  ),
  makeAbiFunctionHandler(erc1155SafeBatchTransferFromAbi, onErc1155TransfersParse),
  makeAbiFunctionHandler(erc1155SafeTransferFromAbi, ({ args: [tokensSender, recipient, id, value, data], ...rest }) =>
    onErc1155TransfersParse({ args: [tokensSender, recipient, [id], [value], data], ...rest })
  ),
  makeAbiFunctionHandler(erc1155MintBatchAbi, onErc1155MintsParse),
  makeAbiFunctionHandler(erc1155MintAbi, ({ args: [recipient, id, value, data], ...rest }) =>
    onErc1155MintsParse({ args: [recipient, [id], [value], data], ...rest })
  ),
  makeAbiFunctionHandler(erc1155BurnBatchAbi, onErc1155BurnsParse),
  makeAbiFunctionHandler(erc1155BurnAbi, ({ args: [tokensSender, id, value], ...rest }) =>
    onErc1155BurnsParse({ args: [tokensSender, [id], [value]], ...rest })
  )
];
