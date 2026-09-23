import { TempleChainKind } from 'src/enums/temple-chain-kind.enum.ts';
import { AccountForChain } from 'src/utils/account.utils.ts';

export type TezosReadOnlySignerPayload = Pick<
  AccountForChain<TempleChainKind.Tezos>,
  'chain' | 'publicKey' | 'address'
>;
