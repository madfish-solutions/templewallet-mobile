import { createStore } from './create-store';
import { createWalletEpic } from './wallet/wallet-epics';

export const store = createStore(createWalletEpic);
