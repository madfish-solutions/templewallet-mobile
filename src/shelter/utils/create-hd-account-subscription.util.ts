import { Dispatch } from '@reduxjs/toolkit';
import { Subject, switchMap } from 'rxjs';

import { AccountInterface } from '../../interfaces/account.interface';
import { loadWhitelistAction } from '../../store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import { Shelter } from '../shelter';

export const createHdAccountSubscription = (
  createHdAccount$: Subject<unknown>,
  accounts: AccountInterface[],
  dispatch: Dispatch
) =>
  createHdAccount$
    .pipe(switchMap(() => Shelter.createHdAccount$(`Account ${accounts.length + 1}`, accounts.length)))
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
        dispatch(loadWhitelistAction.submit());
      }
    });
