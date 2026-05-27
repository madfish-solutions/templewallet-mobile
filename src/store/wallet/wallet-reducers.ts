import { createReducer } from '@reduxjs/toolkit';

import { DEFAULT_HD_WALLET_NAME } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { initialAccountState } from 'src/interfaces/account-state.interface';
import { AccountInterface } from 'src/interfaces/account.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { getAccountAddressForTezos, getAccountId } from 'src/utils/account.utils';
import { isDcpNode } from 'src/utils/network.utils';

import { loadWhitelistAction } from '../tokens-metadata/tokens-metadata-actions';

import {
  addHdAccountAction,
  addTokenAction,
  loadTezosBalanceActions,
  removeTokenAction,
  setSelectedAccountIdAction,
  toggleTokenVisibilityAction,
  updateAccountAction,
  setAccountVisibility,
  loadAssetsBalancesActions,
  setWalletSpecsAction,
  completeEvmAccountsMigrationAction
} from './wallet-actions';
import { walletInitialState, WalletState } from './wallet-state';
import { retrieveAccountState, pushOrUpdateTokensBalances } from './wallet-state.utils';

const normalizeAccount = (account: AccountInterface): AccountInterface => {
  const tezosAddress = getAccountAddressForTezos(account);
  const id = getAccountId(account);

  return {
    ...account,
    id,
    publicKeyHash: account.publicKeyHash || tezosAddress || '',
    tezosAddress: account.tezosAddress ?? (account.type === AccountTypeEnum.HD_ACCOUNT ? tezosAddress : undefined),
    address: account.address ?? (account.type === AccountTypeEnum.IMPORTED_ACCOUNT ? tezosAddress : undefined),
    chain: account.chain ?? (account.type === AccountTypeEnum.IMPORTED_ACCOUNT ? TempleChainKind.Tezos : undefined)
  };
};

export const walletReducers = createReducer<WalletState>(walletInitialState, builder => {
  builder.addCase(addHdAccountAction, (state, { payload }) => {
    const account = normalizeAccount(payload);
    const tezosAddress = getAccountAddressForTezos(account);

    state.accounts.push(account);

    if (tezosAddress) {
      state.accountsStateRecord[tezosAddress] = initialAccountState;
    }

    if (
      account.type === AccountTypeEnum.HD_ACCOUNT &&
      account.walletId &&
      !state.walletsSpecsRecord[account.walletId]
    ) {
      state.walletsSpecsRecord[account.walletId] = {
        id: account.walletId,
        name: DEFAULT_HD_WALLET_NAME,
        createdAt: Date.now()
      };
    }
  });

  builder.addCase(updateAccountAction, (state, { payload }) => {
    const updatedAccount = normalizeAccount(payload);

    state.accounts = state.accounts.map(item =>
      getAccountId(item) === getAccountId(updatedAccount) || item.publicKeyHash === updatedAccount.publicKeyHash
        ? { ...item, ...updatedAccount }
        : item
    );
  });

  builder.addCase(setWalletSpecsAction, (state, { payload }) => {
    state.walletsSpecsRecord[payload.id] = payload;
  });

  builder.addCase(completeEvmAccountsMigrationAction, (state, { payload }) => {
    state.accounts = payload.accounts.map(normalizeAccount);
    state.selectedAccountId = payload.selectedAccountId;
    state.walletsSpecsRecord = payload.walletsSpecsRecord;

    for (const account of state.accounts) {
      const tezosAddress = getAccountAddressForTezos(account);

      if (tezosAddress && !state.accountsStateRecord[tezosAddress]) {
        state.accountsStateRecord[tezosAddress] = initialAccountState;
      }
    }
  });

  builder.addCase(setAccountVisibility, (state, { payload: { publicKeyHash, isVisible } }) => {
    const accountState = retrieveAccountState(state, publicKeyHash);

    if (accountState) {
      accountState.isVisible = isVisible;
    }
  });

  builder.addCase(loadWhitelistAction.success, (state, { payload }) => {
    for (const accountState of Object.values(state.accountsStateRecord)) {
      if (!accountState.tokensList) {
        // `tokensList` appeared to be undefined once
        console.warn('Tokens list absent for some account state');
        accountState.tokensList = [];
      }
      const currentSlugs = new Set(accountState.tokensList.map(({ slug }) => slug));

      for (const token of payload) {
        const slug = toTokenSlug(token.contractAddress, token.fa2TokenId);
        if (!currentSlugs.has(slug)) {
          accountState.tokensList.push({
            slug,
            balance: '0',
            visibility: VisibilityEnum.InitiallyHidden
          });
        }
      }
    }
  });

  builder.addCase(setSelectedAccountIdAction, (state, { payload: accountId }) => {
    if (!accountId) return;

    state.selectedAccountId = accountId;
  });

  builder.addCase(loadTezosBalanceActions.success, (state, { payload }) => {
    for (const pkh in payload) {
      const newBalance = payload[pkh];

      if (!newBalance) {
        return;
      }

      const accountState = retrieveAccountState(state, pkh);
      if (accountState) {
        accountState.tezosBalance = newBalance;
      }
    }
  });

  builder.addCase(
    loadAssetsBalancesActions.success,
    (state, { payload: { publicKeyHash, balances, selectedRpcUrl } }) => {
      const accountState = retrieveAccountState(state, publicKeyHash);
      if (!accountState) {
        return;
      }

      pushOrUpdateTokensBalances(
        isDcpNode(selectedRpcUrl) ? accountState.dcpTokensList : accountState.tokensList,
        balances
      );
    }
  );

  builder.addCase(addTokenAction, (state, { payload: tokenMetadata }) => {
    const accountState = retrieveAccountState(state);
    if (!accountState) {
      return;
    }

    const slug = getTokenSlug(tokenMetadata);

    const removedI = accountState.removedTokensList.findIndex(s => s === slug);
    if (removedI > -1) {
      accountState.removedTokensList.splice(removedI, 1);
    }

    if (!accountState.tokensList.some(t => t.slug === slug)) {
      accountState.tokensList.push({
        slug,
        balance: '0',
        visibility: VisibilityEnum.InitiallyHidden
      });
    }
  });

  builder.addCase(removeTokenAction, (state, { payload: slug }) => {
    const accountState = retrieveAccountState(state);

    if (accountState && !accountState.removedTokensList.includes(slug)) {
      accountState.removedTokensList.push(slug);
    }
  });

  builder.addCase(toggleTokenVisibilityAction, (state, { payload: { slug, selectedRpcUrl } }) => {
    const accountState = retrieveAccountState(state);

    const token = accountState?.[isDcpNode(selectedRpcUrl) ? 'dcpTokensList' : 'tokensList']?.find(
      t => t.slug === slug
    );

    if (token) {
      token.visibility = token.visibility === VisibilityEnum.Visible ? VisibilityEnum.Hidden : VisibilityEnum.Visible;
    }
  });
});
