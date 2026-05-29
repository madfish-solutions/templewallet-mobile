import { nanoid } from '@reduxjs/toolkit';
import { isEqual } from 'lodash-es';
import type { MigrationManifest, PersistedState } from 'redux-persist';

import { isIOS } from 'src/config/system';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from 'src/interfaces/account-state.interface';
import type { HDAccount, ImportedChainAccount, WatchOnlyDebugAccount } from 'src/interfaces/account.interfaces';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { OVERRIDEN_MAINNET_TOKENS_METADATA, PREDEFINED_DCP_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { DCP_RPC, MARIGOLD_RPC, OLD_TEMPLE_RPC_URLS, TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { EVM_ADDRESS_PLACEHOLDER } from '../config/wallet.const.ts';

import { createEntity } from './create-entity';
import { MigratableAccount, TypedPersistedRootState } from './migrations.types.ts';

export const MIGRATIONS: MigrationManifest = {
  '2': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;

    delete state.wallet.addTokenSuggestion;
    delete state.wallet.isShownDomainName;
    delete state.wallet.quipuApy;

    const oldTokensMetadataRecords = state.wallet.tokensMetadata;

    if (oldTokensMetadataRecords) {
      delete state.wallet.tokensMetadata;
      state.tokensMetadata.metadataRecord = oldTokensMetadataRecords;
    }

    return state;
  },
  '3': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;

    const tokensMetadataRecords = state.tokensMetadata.metadataRecord;

    // Overrides
    for (const metadata of OVERRIDEN_MAINNET_TOKENS_METADATA) {
      const slug = getTokenSlug(metadata);
      tokensMetadataRecords[slug] = {
        ...tokensMetadataRecords[slug],
        ...metadata
      };
    }

    // SIRS
    const sirsToken = tokensMetadataRecords[KNOWN_TOKENS_SLUGS.SIRS];

    if (isDefined(sirsToken) && isDefined(sirsToken.symbol) && sirsToken.symbol !== 'SIRS') {
      tokensMetadataRecords[KNOWN_TOKENS_SLUGS.SIRS] = {
        ...sirsToken,
        decimals: 0,
        name: 'Sirius',
        symbol: 'SIRS',
        thumbnailUri: 'ipfs://QmNXQPkRACxaR17cht5ZWaaKiQy46qfCwNVT5FGZy6qnyp'
      };
    }

    // DCP tokens
    const APX_TOKEN_SLUG = 'KT1N7Rh6SgSdExMPxfnYw1tHqrkSm7cm6JDN_0';

    if (!tokensMetadataRecords[APX_TOKEN_SLUG]) {
      for (const tokenMetadata of PREDEFINED_DCP_TOKENS_METADATA) {
        tokensMetadataRecords[getTokenSlug(tokenMetadata)] = tokenMetadata;
      }
    }

    return state;
  },
  '4': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;

    let rpcList = state.settings.rpcList;

    if (rpcList.some(rpc => OLD_TEMPLE_RPC_URLS.includes(rpc.url))) {
      rpcList = rpcList.filter(rpc => rpc.name !== TEMPLE_RPC.name && rpc.url !== TEMPLE_RPC.url);
      rpcList.unshift(TEMPLE_RPC);

      if (OLD_TEMPLE_RPC_URLS.includes(state.settings.selectedRpcUrl)) {
        state.settings.selectedRpcUrl = TEMPLE_RPC.url;
      }
    }

    if (!rpcList.some(rpc => rpc.url === DCP_RPC.url)) {
      rpcList.push(DCP_RPC);
    }

    if (!rpcList.some(rpc => rpc.url === MARIGOLD_RPC.url)) {
      rpcList.splice(1, 0, MARIGOLD_RPC);
    }

    state.settings.rpcList = rpcList;

    return state;
  },
  '5': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;

    if (state.wallet.accounts[0]?.isVisible === undefined) {
      return state;
    }

    const accounts: MigratableAccount[] = [];
    const accountsStateRecord: StringRecord<AccountStateInterface> = {};

    for (const account of state.wallet.accounts) {
      const currentPkh = account.publicKeyHash;

      if (currentPkh) {
        accountsStateRecord[currentPkh] = {
          isVisible: account.isVisible ?? initialAccountState.isVisible,
          tezosBalance: account.tezosBalance ?? initialAccountState.tezosBalance,
          tokensList:
            account.tokensList?.map(token =>
              isDefined(token.isVisible)
                ? {
                    ...token,
                    visibility: token.isVisible ? VisibilityEnum.Visible : VisibilityEnum.InitiallyHidden,
                    isVisible: undefined
                  }
                : token
            ) ?? initialAccountState.tokensList,
          dcpTokensList: initialAccountState.dcpTokensList,
          removedTokensList: account.removedTokensList ?? initialAccountState.removedTokensList
        };
      }

      accounts.push({
        ...account,
        isVisible: undefined,
        tezosBalance: undefined,
        tokensList: undefined,
        removedTokensList: undefined,
        activityGroups: undefined,
        pendingActivities: undefined
      });
    }

    return {
      ...state,
      wallet: {
        ...state.wallet,
        accounts,
        accountsStateRecord
      }
    };
  },
  '6': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;
    state.settings.rpcList = state.settings.rpcList.filter(({ name, url }) => !isEqual({ name, url }, MARIGOLD_RPC));
    if (state.settings.selectedRpcUrl === MARIGOLD_RPC.url) {
      state.settings.selectedRpcUrl = TEMPLE_RPC.url;
    }

    return state;
  },
  '7': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;
    state.baking.selectedBaker = undefined;
    state.baking.bakersList = createEntity([]);

    return state;
  },
  '8': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;
    if (isIOS) {
      state.settings.isInAppBrowserEnabled = true;
    }

    return state;
  },
  '9': (untypedState: PersistedState): undefined | TypedPersistedRootState => {
    if (!untypedState) {
      return untypedState;
    }
    const state = untypedState as TypedPersistedRootState;

    let hdPosition = 0;
    const migratedAccounts = state.wallet.accounts.map(account => {
      const tezosAddress = account.publicKeyHash!;
      const tezosPublicKey = account.publicKey!;

      const id = nanoid();

      if (account.type === AccountTypeEnum.HD) {
        const hdIndex = hdPosition;
        hdPosition++;

        return {
          id,
          name: account.name,
          type: AccountTypeEnum.HD,
          hdIndex,
          tezosAddress,
          tezosPublicKey,
          // Will be populated with proper values later in runtime migration
          evmAddress: EVM_ADDRESS_PLACEHOLDER,
          evmPublicKey: ''
        } satisfies HDAccount;
      }

      if (account.type === AccountTypeEnum.IMPORTED) {
        return {
          id,
          name: account.name,
          type: AccountTypeEnum.IMPORTED_CHAIN,
          chain: TempleChainKind.Tezos,
          address: tezosAddress,
          publicKey: tezosPublicKey
        } satisfies ImportedChainAccount;
      }

      return {
        id,
        name: account.name,
        type: AccountTypeEnum.WATCH_ONLY_DEBUG,
        chain: TempleChainKind.Tezos,
        address: tezosAddress,
        publicKey: tezosPublicKey
      } satisfies WatchOnlyDebugAccount;
    });

    const migratedAccountsStateRecord = migratedAccounts.reduce<Record<string, AccountStateInterface>>(
      (acc, account) => {
        const tezosAddress = account.type === AccountTypeEnum.HD ? account.tezosAddress : account.address;

        const accountsStateRecord = state.wallet.accountsStateRecord;

        if (accountsStateRecord?.[tezosAddress]) {
          acc[account.id] = accountsStateRecord[tezosAddress];
        }

        return acc;
      },
      {}
    );

    state.wallet.accounts = migratedAccounts;
    state.wallet.accountsStateRecord = migratedAccountsStateRecord;

    const selectedPkh = state.wallet.selectedAccountPublicKeyHash!;
    const selectedAccount = migratedAccounts.find(account => {
      if (account.type === AccountTypeEnum.HD) {
        return account.tezosAddress === selectedPkh;
      }

      return account.address === selectedPkh;
    });

    state.wallet.selectedAccountId = selectedAccount?.id ?? migratedAccounts[0]?.id;
    delete state.wallet.selectedAccountPublicKeyHash;

    return state;
  }
};
