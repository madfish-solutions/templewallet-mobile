import { Dispatch } from '@reduxjs/toolkit';
import { Subject, switchMap, tap } from 'rxjs';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';

import { Shelter } from '../shelter';

export const createHdAccountSubscription = (
  createHdAccount$: Subject<unknown>,
  accounts: AccountInterface[],
  dispatch: Dispatch
) => {
  const hdAccounts = accounts.filter(({ type }) => type === AccountTypeEnum.HD_ACCOUNT);

  return createHdAccount$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(() => Shelter.createHdAccount$(`Account ${accounts.length + 1}`, hdAccounts.length)),
      tap(() => dispatch(hideLoaderAction()))
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountAction(publicData.publicKeyHash));
        dispatch(addHdAccountAction(publicData));
        dispatch(loadWhitelistAction.submit());
      }
    });
};
