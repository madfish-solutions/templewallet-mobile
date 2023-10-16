import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { AccountStateInterface } from 'src/interfaces/account-state.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDcpNode } from 'src/utils/network.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { isCollectible } from 'src/utils/tezos.util';
import { getTokenMetadata } from 'src/utils/token-metadata.utils';
import { getAccountState, getSelectedAccount } from 'src/utils/wallet-account-state.utils';

import { useSelector } from '../selector';
import { useTokensMetadataSelector } from '../tokens-metadata/tokens-metadata-selectors';

export const useAccountsListSelector = () => useSelector(({ wallet }) => wallet.accounts);

/** @deprecated // Too heavy */
export const useVisibleAccountsListSelector = () =>
  useSelector(
    ({ wallet }) => wallet.accounts.filter(account => getAccountState(wallet, account.publicKeyHash).isVisible),
    jsonEqualityFn
  );

export const useHdAccountListSelector = () => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.filter(account => account.type === AccountTypeEnum.HD_ACCOUNT), [accounts]);
};

export const useImportedAccountListSelector = () => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.filter(account => account.type === AccountTypeEnum.IMPORTED_ACCOUNT), [accounts]);
};

export const useIsAuthorisedSelector = () => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.length > 0, [accounts.length]);
};

export const useIsCurrentNodeOfDcp = () => useSelector(state => isDcpNode(state.settings.selectedRpcUrl));

export const useCurrentAccountPkhSelector = () => useSelector(state => state.wallet.selectedAccountPublicKeyHash);

export const useIsAccountVisibleSelector = (publicKeyHash: string): boolean | undefined =>
  useSelector(state => state.wallet.accountsStateRecord[publicKeyHash]?.isVisible);

export const useRawCurrentAccountSelector = () =>
  useSelector(state => {
    const pkh = state.wallet.selectedAccountPublicKeyHash;

    return state.wallet.accounts.find(acc => acc.publicKeyHash === pkh);
  });

export const useRawCurrentAccountStateSelector = (): AccountStateInterface | undefined =>
  useSelector(state => state.wallet.accountsStateRecord[state.wallet.selectedAccountPublicKeyHash]);

/** @deprecated // Too heavy */
export const useSelectedAccountSelector = () => useSelector(({ wallet }) => getSelectedAccount(wallet), jsonEqualityFn);

export const useAccountTzProfile = (publicKeyHash: string) =>
  useSelector(state => state.wallet.accounts.find(a => a.publicKeyHash === publicKeyHash)?.tzProfile);

/** @deprecated // Too heavy !!! */
export const useAssetsListSelector = (): TokenInterface[] =>
  useSelector(state => {
    const selectedAccountState = getAccountState(state.wallet, state.wallet.selectedAccountPublicKeyHash);
    const nodeIsDcp = isDcpNode(state.settings.selectedRpcUrl);

    const tokensList = nodeIsDcp ? selectedAccountState.dcpTokensList : selectedAccountState.tokensList;

    return tokensList
      .filter(token => selectedAccountState.removedTokensList.indexOf(token.slug) === -1)
      .map(token => {
        const visibility =
          token.visibility === VisibilityEnum.InitiallyHidden && Number(token.balance) > 0
            ? VisibilityEnum.Visible
            : token.visibility;

        const metadata = getTokenMetadata(state, token.slug);

        return {
          ...metadata,
          visibility,
          balance: token.balance
        };
      });
  }, jsonEqualityFn);

/** @deprecated // Wrong logic of visibility */
export const useVisibleAssetListSelector = () => {
  const tokensList = useAssetsListSelector();

  return useMemo(() => tokensList.filter(({ visibility }) => visibility === VisibilityEnum.Visible), [tokensList]);
};

export const useAllCurrentAccountAssetsSelector = () =>
  useSelector(
    state => {
      const account = state.wallet.accountsStateRecord[state.wallet.selectedAccountPublicKeyHash];

      if (!account) {
        return null;
      }

      const isDcp = isDcpNode(state.settings.selectedRpcUrl);

      return {
        removed: account.removedTokensList,
        stored: isDcp ? account.dcpTokensList : account.tokensList
      };
    },
    (state1, state2) => state1?.stored === state2?.stored && state1?.removed === state2?.removed
  );

export const useCurrentAccountStoredAssetsListSelector = () => {
  const allAssets = useAllCurrentAccountAssetsSelector();

  return useMemo(() => allAssets?.stored.filter(a => !allAssets.removed.some(slug => slug === a.slug)), [allAssets]);
};

export const useAssetBalanceSelector = (slug: string) => {
  const data = useAllCurrentAccountAssetsSelector();

  return useMemo(() => data?.stored.find(a => a.slug === slug)?.balance, [data?.stored]);
};

export const useCurrentAccountStoredAssetsSelector = (type: 'tokens' | 'collectibles') => {
  const assets = useAllCurrentAccountAssetsSelector();
  const allMetadatas = useTokensMetadataSelector();

  return useMemoWithCompare(
    () => {
      if (!assets) {
        return [];
      }

      return assets.stored.filter(asset => {
        if (assets.removed.some(s => asset.slug === s)) {
          return false;
        }
        const metadata = allMetadatas[asset.slug];
        if (!metadata) {
          return false;
        }

        const assetIsCollectible = isCollectible(metadata);

        return type === 'collectibles' ? assetIsCollectible : assetIsCollectible === false;
      });
    },
    [assets, allMetadatas, type],
    isEqual
  );
};

export const useCurrentAccountTezosBalance = () =>
  useSelector(
    state => state.wallet.accountsStateRecord[state.wallet.selectedAccountPublicKeyHash]?.tezosBalance ?? '0'
  );

export const useTezosBalanceOfKnownAccountSelector = (publicKeyHash: string) =>
  useSelector(state => {
    if (state.wallet.accounts.find(account => account.publicKeyHash === publicKeyHash)) {
      return state.wallet.accountsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
    }

    return state.contactBook.contactsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
  });
