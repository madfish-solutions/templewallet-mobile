import { Dispatch } from '@reduxjs/toolkit';
import { EMPTY, expand, first, of, Subject, switchMap, tap } from 'rxjs';

import { DEFAULT_HD_WALLET_ID } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { loadWhitelistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { addHdAccountAction, setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';

import { Shelter } from '../shelter';

const MAX_HD_SKIP_ATTEMPTS = 10;

const getHdAccountIndex = (account: AccountInterface, fallbackIndex: number) => account.hdIndex ?? fallbackIndex;

export const createHdAccountSubscription = (
  createHdAccount$: Subject<unknown>,
  accounts: AccountInterface[],
  dispatch: Dispatch
) => {
  const hdAccounts = accounts.filter(({ type }) => type === AccountTypeEnum.HD_ACCOUNT);
  const walletId = hdAccounts[0]?.walletId ?? DEFAULT_HD_WALLET_ID;
  const nextHdIndex =
    hdAccounts.length === 0
      ? 0
      : Math.max(...hdAccounts.map((account, index) => getHdAccountIndex(account, index))) + 1;

  return createHdAccount$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(() => {
        let nextIndex = nextHdIndex;
        let attempts = 0;

        return Shelter.createHdAccount$(`Account ${accounts.length + 1}`, {
          walletId,
          accountIndex: nextIndex,
          existingAccounts: accounts
        }).pipe(
          expand(publicData => {
            if (publicData !== undefined) {
              return EMPTY;
            }

            attempts++;

            if (attempts >= MAX_HD_SKIP_ATTEMPTS) {
              return of(undefined);
            }

            nextIndex++;

            return Shelter.createHdAccount$(`Account ${accounts.length + 1}`, {
              walletId,
              accountIndex: nextIndex,
              existingAccounts: accounts
            });
          }),
          first(publicData => publicData !== undefined || attempts >= MAX_HD_SKIP_ATTEMPTS)
        );
      }),
      tap(() => dispatch(hideLoaderAction()))
    )
    .subscribe(publicData => {
      if (publicData !== undefined) {
        dispatch(setSelectedAccountIdAction(publicData.id));
        dispatch(addHdAccountAction(publicData));
        dispatch(loadWhitelistAction.submit());
      }
    });
};
