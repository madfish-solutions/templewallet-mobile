import { Dispatch } from '@reduxjs/toolkit';
import { EMPTY, expand, first, Subject, switchMap, tap } from 'rxjs';

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
  const existingPublicKeyHashes = new Set(accounts.map(a => a.publicKeyHash));
  const hdAccountsCount = accounts.filter(({ type }) => type === AccountTypeEnum.HD_ACCOUNT).length;

  return createHdAccount$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(() => {
        let nextIndex = hdAccountsCount;

        return Shelter.createHdAccount$(`Account ${accounts.length + 1}`, nextIndex).pipe(
          expand(publicData => {
            if (publicData === undefined || !existingPublicKeyHashes.has(publicData.publicKeyHash)) {
              return EMPTY;
            }

            nextIndex++;

            return Shelter.createHdAccount$(`Account ${accounts.length + 1}`, nextIndex);
          }),
          first(publicData => publicData === undefined || !existingPublicKeyHashes.has(publicData.publicKeyHash))
        );
      }),
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
