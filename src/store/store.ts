import { createStore } from './create-store';
import { importWalletEpic } from './wallet/wallet-epics';

export const store = createStore(importWalletEpic);
