import { isAddressEqual } from 'viem';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum.ts';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { getAccountAddressForChain } from 'src/utils/account.utils.ts';

export const hasSameChainAddress = (accounts: Account[], chain: TempleChainKind, address: string) =>
  accounts.some(account => {
    const accountAddress = getAccountAddressForChain(account, chain);

    if (!accountAddress) {
      return false;
    }

    return chain === TempleChainKind.EVM
      ? isAddressEqual(accountAddress as HexString, address as HexString)
      : accountAddress === address;
  });
