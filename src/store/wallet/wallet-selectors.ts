import { useMemo } from 'react';

import { UNKNOWN_TOKEN_SYMBOL } from 'src/config/general';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useSelector } from 'src/store/selector';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isDcpNode } from 'src/utils/network.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { isCollectible, isNonZeroBalance } from 'src/utils/tezos.util';
import { useGetTokenMetadata } from 'src/utils/token-metadata.utils';
import { getAccountState, getSelectedAccount } from 'src/utils/wallet-account-state.utils';
import { useTezosToken } from 'src/utils/wallet.utils';

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

export const useSelectedAccountSelector = () => useSelector(({ wallet }) => getSelectedAccount(wallet), jsonEqualityFn);

export const useAssetsListSelector = (): TokenInterface[] => {
  const { selectedAccountState, isTezosNode } = useSelector(
    ({ wallet, settings }) => ({
      selectedAccountState: getAccountState(wallet, wallet.selectedAccountPublicKeyHash),
      isTezosNode: !isDcpNode(settings.selectedRpcUrl)
    }),
    jsonEqualityFn
  );

  const tokensList = isTezosNode ? selectedAccountState.tokensList : selectedAccountState.dcpTokensList;

  const filteredTokensList = useMemo(
    () => tokensList.filter(token => selectedAccountState.removedTokensList.indexOf(token.slug) === -1),
    [tokensList, selectedAccountState]
  );

  const getTokenMetadata = useGetTokenMetadata();

  return useMemo(
    () =>
      filteredTokensList.map(token => {
        const visibility =
          token.visibility === VisibilityEnum.InitiallyHidden && Number(token.balance) > 0
            ? VisibilityEnum.Visible
            : token.visibility;

        const metadata = getTokenMetadata(token.slug);

        return {
          ...metadata,
          visibility,
          balance: token.balance
        };
      }),
    [filteredTokensList, getTokenMetadata]
  );
};

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

export const useTokensWithTezosListSelector = () => {
  const assetsList = useAssetsListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();

  return useMemo(
    () => [tezosToken, ...assetsList].filter(({ artifactUri }) => !isDefined(artifactUri)),
    [assetsList, tezosToken]
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

export const useCollectiblesListSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(asset => isCollectible(asset) && isNonZeroBalance(asset)), [assetsList]);
};

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
  const tezosBalance = useSelector(({ wallet }) => {
    const accountState = getAccountState(wallet, publicKeyHash);

    return accountState.tezosBalance;
  });

  return useTezosToken(tezosBalance);
};

export const useSelectedAccountTezosTokenSelector = () => {
  const selectedAccountPublicKeyHash = useSelector(({ wallet }) => wallet.selectedAccountPublicKeyHash);

  return useTezosTokenSelector(selectedAccountPublicKeyHash);
};
