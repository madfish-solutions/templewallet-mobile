import { isEqual } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { WR_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import {
  getAccountAddressForChain,
  getAccountAddressForEvm,
  getAccountAddressForTezos,
  getAccountForChain
} from 'src/utils/account.utils';
import { getSelectedAccountFromWallet } from 'src/utils/get-selected-account-from-wallet.util.ts';
import { isDcpNode } from 'src/utils/network.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { isCollectible } from 'src/utils/tezos.util';
import { getAccountState } from 'src/utils/wallet-account-state.utils';

import { useSelector } from '../selector';
import { useTokensMetadataSelector } from '../tokens-metadata/tokens-metadata-selectors';

import { setSelectedAccountIdAction } from './wallet-actions';

export const useAllAccounts = () => useSelector(({ wallet }) => wallet.accounts);

export const useAllVisibleAccounts = () =>
  useSelector(
    ({ wallet }) => wallet.accounts.filter(account => getAccountState(wallet, account.id).isVisible),
    jsonEqualityFn
  );

export const useHDAccounts = () => {
  const accounts = useAllAccounts();

  return useMemo(() => accounts.filter(account => account.type === AccountTypeEnum.HD), [accounts]);
};

export const useImportedAccounts = () => {
  const accounts = useAllAccounts();

  return useMemo(
    () =>
      accounts.filter(
        account =>
          account.type === AccountTypeEnum.IMPORTED_CHAIN || account.type === AccountTypeEnum.IMPORTED_MULTICHAIN
      ),
    [accounts]
  );
};

export const useIsAuthorisedSelector = () => {
  const accounts = useAllAccounts();

  return useMemo(() => accounts.length > 0, [accounts.length]);
};

export const useCurrentAccountId = () => useSelector(({ wallet }) => wallet.selectedAccountId);

export const useIsAccountVisibleSelector = (publicKeyHash: string): boolean | undefined =>
  useSelector(state => state.wallet.accountsStateRecord[publicKeyHash]?.isVisible);

export const useRawCurrentAccountSelector = () => useSelector(({ wallet }) => getSelectedAccountFromWallet(wallet));

export const useAccount = () => useSelector(({ wallet }) => getSelectedAccountFromWallet(wallet), jsonEqualityFn);

export const useAccountAddressForTezos = () =>
  useSelector(({ wallet }) => {
    const account = getSelectedAccountFromWallet(wallet);

    return account ? getAccountAddressForTezos(account) : undefined;
  });

export const useAccountAddressForEvm = () =>
  useSelector(({ wallet }) => {
    const account = getSelectedAccountFromWallet(wallet);

    return account ? getAccountAddressForEvm(account) : undefined;
  });

export const useCurrentAccountForChainSelector = (chain: TempleChainKind) =>
  useSelector(({ wallet }) => {
    const account = getSelectedAccountFromWallet(wallet);

    return account ? getAccountForChain(account, chain) : null;
  }, jsonEqualityFn);

export const useAccountForTezos = () => useCurrentAccountForChainSelector(TempleChainKind.Tezos);

export const useAccountForEvm = () => useCurrentAccountForChainSelector(TempleChainKind.EVM);

export const useSetAccountId = () => {
  const dispatch = useDispatch();

  return useCallback((accountId: string) => dispatch(setSelectedAccountIdAction(accountId)), [dispatch]);
};

export const useAllCurrentAccountAssetsSelector = () =>
  useSelector(
    state => {
      const selectedAccount = getSelectedAccountFromWallet(state.wallet);
      const tezosAddress = selectedAccount ? getAccountAddressForTezos(selectedAccount) : undefined;
      const account = tezosAddress ? state.wallet.accountsStateRecord[tezosAddress] : undefined;

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

        const assetIsCollectible =
          isCollectible(metadata) && asset.slug !== toTokenSlug(WR_TOKEN_METADATA.address, WR_TOKEN_METADATA.id);

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
  useSelector(({ wallet }) => {
    const account = getSelectedAccountFromWallet(wallet);
    const tezosAddress = account ? getAccountAddressForChain(account, TempleChainKind.Tezos) : undefined;

    return tezosAddress ? wallet.accountsStateRecord[tezosAddress]?.tezosBalance ?? '0' : '0';
  });

export const useTezosBalanceOfKnownAccountSelector = (publicKeyHash: string) =>
  useSelector(state => {
    if (state.wallet.accounts.some(account => getAccountAddressForTezos(account) === publicKeyHash)) {
      return state.wallet.accountsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
    }

    return state.contactBook.contactsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
  });
