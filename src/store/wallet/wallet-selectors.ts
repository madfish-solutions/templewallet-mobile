import { isEqual } from 'lodash-es';
import { useCallback, useMemo } from 'react';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { isDcpNode } from 'src/utils/network.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { isCollectible } from 'src/utils/tezos.util';
import { getAccountState, getSelectedAccount } from 'src/utils/wallet-account-state.utils';

import { useSelector } from '../selector';
import { useTokensMetadataSelector } from '../tokens-metadata/tokens-metadata-selectors';

export const useAccountsListSelector = () => useSelector(({ wallet }) => wallet.accounts);

/** @deprecated */
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

export const useCurrentAccountPkhSelector = () => useSelector(state => state.wallet.selectedAccountPublicKeyHash);

export const useIsAccountVisibleSelector = (publicKeyHash: string): boolean | undefined =>
  useSelector(state => state.wallet.accountsStateRecord[publicKeyHash]?.isVisible);

export const useRawCurrentAccountSelector = () =>
  useSelector(state => {
    const pkh = state.wallet.selectedAccountPublicKeyHash;

    return state.wallet.accounts.find(acc => acc.publicKeyHash === pkh);
  });

/** @deprecated */
export const useSelectedAccountSelector = () => useSelector(({ wallet }) => getSelectedAccount(wallet), jsonEqualityFn);

export const useAllCurrentAccountAssetsSelector = () =>
  useSelector(
    state => {
      const account = state.wallet.accountsStateRecord[state.wallet.selectedAccountPublicKeyHash];

      if (!account) {
        return null;
      }

      const isDcp = isDcpNode(state.settings.selectedRpcUrl);

      // (!) Somehow, after wallet reset, witnessed `account.removedTokensList` & `account.dcpTokensList` be `undefined`
      return {
        removed: account.removedTokensList ?? [],
        stored: (isDcp ? account.dcpTokensList : account.tokensList) ?? []
      };
    },
    (state1, state2) => state1?.stored === state2?.stored && state1?.removed === state2?.removed
  );

export const useCurrentAccountStoredAssetsListSelector = () => {
  const allAssets = useAllCurrentAccountAssetsSelector();

  return useMemo(() => allAssets?.stored.filter(a => !allAssets.removed.some(slug => slug === a.slug)), [allAssets]);
};

/** @todo Store tokens & collectibles separately */
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

export const useAssetBalanceSelector = (slug: string) => {
  const data = useAllCurrentAccountAssetsSelector();

  return useMemo(() => data?.stored.find(a => a.slug === slug)?.balance, [data?.stored]);
};

export const useTokenBalanceGetter = () => {
  const data = useAllCurrentAccountAssetsSelector();

  const balancesBySlug = useMemo(
    () => Object.fromEntries((data?.stored ?? []).map(({ slug, balance }) => [slug, balance])),
    [data]
  );

  return useCallback((slug: string): string | undefined => balancesBySlug[slug], [balancesBySlug]);
};

export const useCurrentAccountTezosBalance = () =>
  useSelector(({ wallet }) => wallet.accountsStateRecord[wallet.selectedAccountPublicKeyHash]?.tezosBalance ?? '0');

export const useTezosBalanceOfKnownAccountSelector = (publicKeyHash: string) =>
  useSelector(state => {
    if (state.wallet.accounts.some(account => account.publicKeyHash === publicKeyHash)) {
      return state.wallet.accountsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
    }

    return state.contactBook.contactsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
  });
