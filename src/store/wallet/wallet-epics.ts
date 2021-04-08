import { Observable } from 'rxjs';
import { Action } from 'ts-action';
import { importWalletActions } from './wallet-actions';
import { ofType, toPayload } from 'ts-action-operators';
import { map } from 'rxjs/operators';
import { importWallet } from '../../utils/wallet.util';

export const importWalletEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(importWalletActions.create), toPayload(), importWallet(), map(importWalletActions.success));
