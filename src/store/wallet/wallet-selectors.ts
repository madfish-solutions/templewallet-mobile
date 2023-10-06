import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { UNKNOWN_TOKEN_SYMBOL } from 'src/config/general';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { AccountStateInterface } from 'src/interfaces/account-state.interface';
import { TEMPLE_TOKEN } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { isDcpNode } from 'src/utils/network.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { isCollectible, isNonZeroBalance } from 'src/utils/tezos.util';
import { getTokenMetadata } from 'src/utils/token-metadata.utils';
import { getAccountState, getSelectedAccount } from 'src/utils/wallet-account-state.utils';
import { useTezosToken } from 'src/utils/wallet.utils';

import { useSelector } from '../selector';
import { useTokensMetadataSelector } from '../tokens-metadata/tokens-metadata-selectors';

export const useAccountsListSelector = () => useSelector(({ wallet }) => wallet.accounts);

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

export const useSelectedAccountPKH = () => useSelector(state => state.wallet.selectedAccountPublicKeyHash);

export const useRawCurrentAccountSelector = (): AccountStateInterface | undefined =>
  useSelector(state => state.wallet.accountsStateRecord[state.wallet.selectedAccountPublicKeyHash]);

/** @deprecated // Too heavy */
export const useSelectedAccountSelector = () => useSelector(({ wallet }) => getSelectedAccount(wallet), jsonEqualityFn);

/** @deprecated // Too heavy */
export const useAssetsListSelector = (): TokenInterface[] =>
  useSelector(state => {
    console.log('This better not be called every time Redux state changes');
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

export const useVisibleAssetListSelector = () => {
  const tokensList = useAssetsListSelector();

  return useMemo(() => tokensList.filter(({ visibility }) => visibility === VisibilityEnum.Visible), [tokensList]);
};

export const useTokensListSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(({ artifactUri }) => !isDefined(artifactUri)), [assetsList]);
};

export const useTokenSelector = (tokenSlug: string) => {
  const tokensList = useTokensListSelector();

  return useMemo(
    () => tokensList.find(({ address, id }) => getTokenSlug({ address, id }) === tokenSlug),
    [tokensList, tokenSlug]
  );
};

export const useVisibleTokensListSelector = () => {
  const tokensList = useTokensListSelector();

  return useMemo(
    () =>
      tokensList.filter(
        ({ visibility, symbol }) => visibility === VisibilityEnum.Visible && symbol !== UNKNOWN_TOKEN_SYMBOL
      ),
    [tokensList]
  );
};

export const useAllCurrentAccountStoredAssetsSelector = () =>
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

export const useAllCurrentAccountStoredCollectiblesSelector = () => {
  const assets = useAllCurrentAccountStoredAssetsSelector();
  const allMetadatas = useTokensMetadataSelector();

  return useMemoWithCompare(
    () => {
      if (!assets) {
        return { stored: [], removed: [] };
      }
      const stored = assets.stored.filter(asset => {
        const metadata = allMetadatas[asset.slug];

        return isTruthy(metadata) && isCollectible(metadata);
      });

      return { stored, removed: assets.removed };
    },
    [assets, allMetadatas],
    isEqual
  );
};

export const useCurrentAccountCollectiblesSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(asset => isCollectible(asset)), [assetsList]);
};

export const useCollectiblesListSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(asset => isCollectible(asset) && isNonZeroBalance(asset)), [assetsList]);
};

export const useCollectibleSelector = (slug: string) => {
  const collectibles = useCollectiblesListSelector();

  return useMemo(() => collectibles.find(collectible => getTokenSlug(collectible) === slug), [slug, collectibles]);
};

// ts-prune-ignore-next-line
export const useVisibleCollectiblesListSelector = () => {
  const collectiblesList = useCollectiblesListSelector();

  return useMemo(
    () => collectiblesList.filter(({ visibility }) => visibility === VisibilityEnum.Visible),
    [collectiblesList]
  );
};

export const useIsVisibleSelector = (publicKeyHash: string) =>
  useSelector(({ wallet }) => {
    const accountState = getAccountState(wallet, publicKeyHash);

    return accountState.isVisible;
  });

export const useTezosTokenSelector = (publicKeyHash: string) => {
  const tezosBalance = useSelector(state => {
    if (state.wallet.accounts.find(account => account.publicKeyHash === publicKeyHash)) {
      const accountState = getAccountState(state.wallet, publicKeyHash);

      return accountState.tezosBalance;
    }

    return state.contactBook.contactsStateRecord[publicKeyHash]?.tezosBalance ?? '0';
  });

  return useTezosToken(tezosBalance);
};

export const useSelectedAccountTezosTokenSelector = (): TokenInterface => {
  const selectedAccountPublicKeyHash = useSelector(({ wallet }) => wallet.selectedAccountPublicKeyHash);

  return useTezosTokenSelector(selectedAccountPublicKeyHash);
};

export const useSelectedAccountTkeyTokenSelector = (): TokenInterface => {
  const tkey = useTokenSelector(toTokenSlug(TEMPLE_TOKEN.address, TEMPLE_TOKEN.id));

  return tkey ?? TEMPLE_TOKEN;
};
