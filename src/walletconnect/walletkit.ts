import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX, WC_PROJECT_ID } from '../utils/env.utils';

const core = new Core({ projectId: WC_PROJECT_ID });

export const walletKitPromise = WalletKit.init({
  core, // <- pass the shared `core` instance
  metadata: {
    name: 'Temple Wallet Mobile',
    description: 'Dedicated mobile app to cover all your Tezos and EVM DeFi needs',
    url: 'www.templewallet.com',
    icons: ['https://ipfs.io/ipfs/bafkreigwikllka4svf345zilxj6lq6glpe4djsqummmjfhigszwqaufjum'],
    redirect: {
      native: 'temple://',
      universal: UNIVERSAL_LINKS_DOMAIN_URI_PREFIX
    }
  }
});
