import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AccountTypeEnum } from '../../enums/account-type.enum';
import { VisibilityEnum } from '../../enums/visibility.enum';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import { ActivityGroup } from '../../interfaces/activity.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { isCollectible, isNonZeroBalance } from '../../utils/tezos.util';
import { getWalletAccountState, walletAccountStateToWalletAccount } from '../../utils/wallet-account-state.utils';
import { getTezosToken } from '../../utils/wallet.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useAccountsListSelector = () =>
  useSelector<WalletRootState, WalletAccountInterface[]>(
    ({ wallet }) => wallet.accounts.map(walletAccountStateToWalletAccount),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useVisibleAccountsListSelector = () => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.filter(account => account.isVisible), [accounts]);
};

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

export const useSelectedAccountSelector = (): WalletAccountInterface =>
  useSelector<WalletRootState, WalletAccountInterface>(
    ({ wallet }) => {
      const walletAccountState = getWalletAccountState(wallet.accounts, wallet.selectedAccountPublicKeyHash);

      return walletAccountStateToWalletAccount(walletAccountState);
    },
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useActivityGroupsSelector = () =>
  useSelector<WalletRootState, ActivityGroup[]>(
    ({ wallet }) => {
      const walletAccountState = getWalletAccountState(wallet.accounts, wallet.selectedAccountPublicKeyHash);

      return [...walletAccountState.pendingActivities, ...walletAccountState.activityGroups.data];
    },
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useTokensMetadataSelector = () =>
  useSelector<WalletRootState, WalletState['tokensMetadata']>(
    ({ wallet }) => wallet.tokensMetadata,
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useAssetsListSelector = (): TokenInterface[] => {
  const selectedAccount = useSelectedAccountSelector();
  const getTokenMetadata = useTokenMetadataGetter();

  return useMemo<TokenInterface[]>(
    () =>
      selectedAccount.tokensList
        .filter(item => selectedAccount.removedTokensList.indexOf(item.slug) === -1)
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
    [selectedAccount.tokensList, getTokenMetadata, selectedAccount.removedTokensList]
  );
};

export const useVisibleAssetListSelector = () => {
  const tokensList = useAssetsListSelector();

  return useMemo(() => tokensList.filter(({ visibility }) => visibility === VisibilityEnum.Visible), [tokensList]);
};

export const useQuipuApySelector = () =>
  useSelector<WalletRootState, WalletState['quipuApy']>(({ wallet }) => wallet.quipuApy);

export const useTokensListSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(({ artifactUri }) => !isDefined(artifactUri)), [assetsList]);
};

export const useTokensWithTezosListSelector = () => {
  const assetsList = useAssetsListSelector();
  const tezosToken = useTezosTokenSelector();

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

export const useTezosTokenSelector = (): TokenInterface => {
  const tezosBalance = useSelectedAccountSelector().tezosBalance;

  return useMemo(() => getTezosToken(tezosBalance), [tezosBalance]);
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);
