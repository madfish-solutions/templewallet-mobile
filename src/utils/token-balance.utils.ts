import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { isDefined } from './is-defined';
import { michelEncoder } from './network/network.util';
import { MAINNET_NETWORK } from './network/networks';

const TEMPLE_WALLET_LV_ACCOUNT_PKH = 'tz1fVQangAfb9J1hRRMP2bSB6LvASD6KpY8A';
const TEMPLE_WALLET_LV_ACCOUNT_PUBLIC_KEY = 'edpkvWbk81uh1DEvdWKR4g1bjyTGhdu1mDvznPUFE2zDwNsLXrEb9K';

class LambdaViewSigner {
  async publicKeyHash() {
    return TEMPLE_WALLET_LV_ACCOUNT_PKH;
  }

  async publicKey() {
    return TEMPLE_WALLET_LV_ACCOUNT_PUBLIC_KEY;
  }

  async secretKey(): Promise<string> {
    throw new Error('Secret key cannot be exposed');
  }

  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    throw new Error('Cannot sign');
  }
}

const lambdaSigner = new LambdaViewSigner();

function loadContractForCallLambdaView(tezos: TezosToolkit, address: string) {
  tezos = new TezosToolkit(tezos.rpc);
  tezos.setSignerProvider(lambdaSigner);
  tezos.setPackerProvider(michelEncoder);

  return tezos.contract.at(address);
}

export async function fetchBalance(
  tezos: TezosToolkit,
  token: Pick<TokenMetadataInterface, 'id' | 'address'>,
  accountPublicKeyHash: string
) {
  const tokenContract = await loadContractForCallLambdaView(tezos, token.address);

  let rawBalance: BigNumber | undefined;
  try {
    rawBalance = await tokenContract.views.getBalance(accountPublicKeyHash).read(MAINNET_NETWORK.lambdaContract);
  } catch (e) {
    const response = await tokenContract.views
      .balance_of([{ owner: accountPublicKeyHash, token_id: token.id }])
      .read(MAINNET_NETWORK.lambdaContract);
    rawBalance = response[0].balance;
  }

  return isDefined(rawBalance) && !rawBalance.isNaN() ? rawBalance : new BigNumber(0);
}
