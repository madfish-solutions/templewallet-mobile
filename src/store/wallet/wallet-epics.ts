import { Observable } from 'rxjs';
import { Action } from 'ts-action';
import { createWalletActions, importWalletActions } from './wallet-actions';
import { ofType, toPayload } from 'ts-action-operators';
import { map } from 'rxjs/operators';
import { createWallet, importWallet } from '../../utils/wallet.util';
import { combineEpics } from 'redux-observable';

const importWalletEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(importWalletActions.submit), toPayload(), importWallet(), map(importWalletActions.success));

const createWalletEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(createWalletActions.submit), toPayload(), createWallet(), map(createWalletActions.success));

export const walletEpics = combineEpics(importWalletEpic, createWalletEpic);
