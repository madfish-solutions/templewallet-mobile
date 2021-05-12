import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';

import { initialAccountSettings } from '../../interfaces/account-settings.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { emptyTokenMetadataInterface, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenToTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz } from '../../utils/tezos.util';
import { createEntity } from '../create-entity';
import { loadTezosAssetsActions, loadTokenAssetsActions } from './assets-actions';
import { addHdAccount, setSelectedAccount } from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';

const updateCurrentAccountState = (
  state: WalletState,
  updateFn: (currentAccount: WalletAccountInterface) => Partial<WalletAccountInterface>
): WalletState => ({
  ...state,
  hdAccounts: state.hdAccounts.map(account =>
    account.publicKeyHash === state.selectedAccountPublicKeyHash ? { ...account, ...updateFn(account) } : account
  )
});

export const walletsReducer = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccount, (state, { payload }) => ({
    ...state,
    hdAccounts: [...state.hdAccounts, { ...payload, ...initialAccountSettings }]
  }));
  builder.addCase(setSelectedAccount, (state, { payload }) => ({
    ...state,
    selectedAccountPublicKeyHash: payload ?? ''
  }));

  builder.addCase(loadTezosAssetsActions.submit, state =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity('0', true) }))
  );
  builder.addCase(loadTezosAssetsActions.success, (state, { payload }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity(payload, false) }))
  );
  builder.addCase(loadTezosAssetsActions.fail, (state, { payload }) =>
    updateCurrentAccountState(state, () => ({ tezosBalance: createEntity('0', false, payload) }))
  );

  builder.addCase(loadTokenAssetsActions.success, (state, { payload }) =>
    payload.reduce((prevState, { token_id, contract, name, symbol, decimals, balance }) => {
      const tokenMetadata: TokenMetadataInterface = {
        ...emptyTokenMetadataInterface,
        id: token_id,
        address: contract,
        ...(isDefined(name) && { name }),
        ...(isDefined(symbol) && { symbol }),
        ...(isDefined(decimals) && { decimals })
      };

      const slug = tokenToTokenSlug(tokenMetadata);

      const newState: WalletState = {
        ...prevState,
        tokensMetadata: {
          ...prevState.tokensMetadata,
          [slug]: tokenMetadata
        }
      };

      const accountToken: AccountTokenInterface = {
        slug,
        balance: mutezToTz(new BigNumber(balance), tokenMetadata.decimals).toString(),
        isShown: true
      };

      return updateCurrentAccountState(newState, (currentAccount) => {
        let didUpdate = false;

        const tokensList = currentAccount.tokensList.map(token => {
          if (token.slug === slug) {
            didUpdate = true;

            return accountToken;
          }

          return token;
        });

        if (!didUpdate) {
          tokensList.push(accountToken);
        }

        return { tokensList };
      });
    }, state)
  );
});
