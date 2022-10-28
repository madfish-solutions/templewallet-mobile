import { Dispatch } from '@reduxjs/toolkit';
import { Subject, switchMap, tap } from 'rxjs';

import { AccountInterface } from '../../interfaces/account.interface';
import { hideLoaderAction, showLoaderAction } from '../../store/settings/settings-actions';
import { loadWhitelistAction } from '../../store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { Shelter } from '../shelter';

export const createHdAccountSubscription = (
  createHdAccount$: Subject<unknown>,
  accounts: AccountInterface[],
  dispatch: Dispatch
) =>
  createHdAccount$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(() => Shelter.createHdAccount$(`Account ${accounts.length + 1}`, accounts.length)),
      tap(() => dispatch(hideLoaderAction()))
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
        dispatch(loadWhitelistAction.submit());
      }
    });
