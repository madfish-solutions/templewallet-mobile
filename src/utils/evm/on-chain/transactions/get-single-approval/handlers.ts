import { toEvmAssetSlug } from 'src/utils/from-token-slug';

import { erc20AllowanceAbi, erc20ApproveAbi, erc20IncreaseAllowanceAbi } from '../../abi/erc20.abi';
import { erc721ApproveAbi } from '../../abi/erc721.abi';
import { EvmAssetStandard } from '../../types';
import { Approval, makeAbiFunctionHandler, targetIsErc20, targetIsErc721, toBigNumber } from '../helpers';

export const knownOperationsHandlers = [
  makeAbiFunctionHandler(
    erc20ApproveAbi,
    async ({ args: [spender, amount], to }): Promise<Approval> => ({
      assetSlug: toEvmAssetSlug(to),
      spender,
      amount: toBigNumber(amount),
      standard: EvmAssetStandard.ERC20
    }),
    targetIsErc20
  ),
  makeAbiFunctionHandler(
    erc20IncreaseAllowanceAbi,
    async ({ args: [spender, amount], readContract, sender, to }): Promise<Approval> => {
      const previousAllowance = await readContract({
        abi: [erc20AllowanceAbi],
        functionName: 'allowance',
        args: [sender, spender],
        address: to
      });

      return {
        assetSlug: toEvmAssetSlug(to),
        spender,
        amount: toBigNumber(amount + previousAllowance),
        standard: EvmAssetStandard.ERC20
      };
    }
  ),
  makeAbiFunctionHandler(
    erc721ApproveAbi,
    async ({ args: [spender, tokenId], to }): Promise<Approval> => ({
      assetSlug: toEvmAssetSlug(to, tokenId.toString()),
      spender,
      amount: toBigNumber(1),
      standard: EvmAssetStandard.ERC721
    }),
    targetIsErc721
  )
];
