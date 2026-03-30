import { isEqual } from 'lodash-es';
import type { MigrationManifest, PersistedState } from 'redux-persist';

import { isIOS } from 'src/config/system';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from 'src/interfaces/account-state.interface';
import type { AccountInterface } from 'src/interfaces/account.interface';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { OVERRIDEN_MAINNET_TOKENS_METADATA, PREDEFINED_DCP_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { DCP_RPC, MARIGOLD_RPC, OLD_TEMPLE_RPC_URLS, TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { createEntity } from './create-entity';
import type { RootState } from './types';

type TypedPersistedRootState = Exclude<PersistedState, undefined> & RootState;

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

    const accounts: AccountInterface[] = [];
    const accountsStateRecord: StringRecord<AccountStateInterface> = {};

    for (const account of state.wallet.accounts) {
      accountsStateRecord[account.publicKeyHash] = {
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
  }
};
