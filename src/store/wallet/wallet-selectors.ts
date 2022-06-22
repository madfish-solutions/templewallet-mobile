import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AccountTypeEnum } from '../../enums/account-type.enum';
import { VisibilityEnum } from '../../enums/visibility.enum';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import { AccountStateInterface } from '../../interfaces/account-state.interface';
import { AccountInterface } from '../../interfaces/account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { isCollectible, isNonZeroBalance } from '../../utils/tezos.util';
import { getSelectedAccount, getAccountState } from '../../utils/wallet-account-state.utils';
import { getTezosToken } from '../../utils/wallet.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useAccountsListSelector = () =>
  useSelector<WalletRootState, WalletState['accounts']>(({ wallet }) => wallet.accounts);

export const useVisibleAccountsListSelector = () =>
  useSelector<WalletRootState, WalletState['accounts']>(
    ({ wallet }) => wallet.accounts.filter(account => getAccountState(wallet, account.publicKeyHash).isVisible),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
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

export const useSelectedAccountSelector = () =>
  useSelector<WalletRootState, AccountInterface>(({ wallet }) => getSelectedAccount(wallet));

export const useSelectedAccountStateSelector = () =>
  useSelector<WalletRootState, AccountStateInterface>(({ wallet }) =>
    getAccountState(wallet, wallet.selectedAccountPublicKeyHash)
  );

export const useActivityGroupsSelector = () => {
  const selectedAccountState = useSelectedAccountStateSelector();

  return useMemo(
    () => [...selectedAccountState.pendingActivities, ...selectedAccountState.activityGroups],
    [selectedAccountState.pendingActivities, selectedAccountState.activityGroups]
  );
};

export const useAssetsListSelector = (): TokenInterface[] => {
  const selectedAccountState = useSelectedAccountStateSelector();
  const getTokenMetadata = useTokenMetadataGetter();

  return useMemo<TokenInterface[]>(
    () =>
      selectedAccountState.tokensList
        .filter(item => selectedAccountState.removedTokensList.indexOf(item.slug) === -1)
        .map(({ slug, balance, visibility }) => {
          if (visibility === VisibilityEnum.InitiallyHidden && Number(balance) > 0) {
            return {
              balance,
              visibility: VisibilityEnum.Visible,
              ...getTokenMetadata(slug)
            };
          }

          return {
            balance,
            visibility,
            ...getTokenMetadata(slug)
          };
        }),
    [selectedAccountState.tokensList, getTokenMetadata, selectedAccountState.removedTokensList]
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

  return useMemo(() => tokensList.filter(({ visibility }) => visibility === VisibilityEnum.Visible), [tokensList]);
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
  useSelector<WalletRootState, AccountStateInterface['isVisible']>(({ wallet }) => {
    const accountState = getAccountState(wallet, publicKeyHash);

    return accountState.isVisible;
  });

export const useTezosTokenSelector = (publicKeyHash: string) => {
  const tezosBalance = useSelector<WalletRootState, AccountStateInterface['tezosBalance']>(({ wallet }) => {
    const accountState = getAccountState(wallet, publicKeyHash);

    return accountState.tezosBalance;
  });

  return useMemo(() => getTezosToken(tezosBalance), [tezosBalance]);
};

export const useSelectedAccountTezosTokenSelector = () => {
  const selectedAccountPublicKeyHash = useSelector<WalletRootState, WalletState['selectedAccountPublicKeyHash']>(
    ({ wallet }) => wallet.selectedAccountPublicKeyHash
  );

  return useTezosTokenSelector(selectedAccountPublicKeyHash);
};
