import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AccountTypeEnum } from '../../enums/account-type.enum';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { isCollectible, isNonZeroBalance } from '../../utils/tezos.util';
import { walletAccountStateToWalletAccount } from '../../utils/wallet-account-state.utils';
import { getTezosToken } from '../../utils/wallet.utils';
import { WalletRootState, WalletState } from './wallet-state';

export const useAccountsListSelector = () => {
  const accounts = useSelector<WalletRootState, WalletAccountStateInterface[]>(({ wallet }) => wallet.accounts);

  return useMemo(() => accounts.map(walletAccountStateToWalletAccount), [accounts]);
};

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

const useSelectedAccountStateSelector = (): WalletAccountStateInterface => {
  const { accounts, selectedAccountPublicKeyHash } = useSelector<WalletRootState, WalletState>(({ wallet }) => wallet);

  // TODO: OPTIMIZE SELECTED ACCOUNT SELECTOR ASAP
  return useMemo(
    () => ({
      ...initialWalletAccountState,
      ...accounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash)
    }),
    [accounts, selectedAccountPublicKeyHash]
  );
};

export const useSelectedAccountSelector = (): WalletAccountInterface => {
  const selectedAccountState = useSelectedAccountStateSelector();

  return useMemo(() => walletAccountStateToWalletAccount(selectedAccountState), [selectedAccountState]);
};

export const useActivityGroupsSelector = () => {
  const pendingActivityGroups = useSelectedAccountStateSelector().pendingActivities;
  const appliedActivityGroups = useSelectedAccountStateSelector().activityGroups.data;

  return useMemo(
    () => [...pendingActivityGroups, ...appliedActivityGroups],
    [pendingActivityGroups, appliedActivityGroups]
  );
};

export const useTokensMetadataSelector = () =>
  useSelector<WalletRootState, WalletState['tokensMetadata']>(({ wallet }) => wallet.tokensMetadata);

export const useAssetsListSelector = (): TokenInterface[] => {
  const selectedAccount = useSelectedAccountSelector();
  const getTokenMetadata = useTokenMetadataGetter();

  return useMemo<TokenInterface[]>(
    () =>
      selectedAccount.tokensList
        .filter(item => selectedAccount.removedTokensList.indexOf(item.slug) === -1)
        .map(({ slug, balance, isVisible }) => ({
          balance,
          isVisible,
          ...getTokenMetadata(slug)
        })),
    [selectedAccount.tokensList, getTokenMetadata, selectedAccount.removedTokensList]
  );
};

export const useVisibleAssetListSelector = () => {
  const tokensList = useAssetsListSelector();

  return useMemo(() => tokensList.filter(({ isVisible }) => isVisible), [tokensList]);
};

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

  return useMemo(() => tokensList.filter(({ isVisible }) => isVisible), [tokensList]);
};

export const useCollectiblesListSelector = () => {
  const assetsList = useAssetsListSelector();

  return useMemo(() => assetsList.filter(asset => isCollectible(asset) && isNonZeroBalance(asset)), [assetsList]);
};

export const useVisibleCollectiblesListSelector = () => {
  const collectiblesList = useCollectiblesListSelector();

  return useMemo(() => collectiblesList.filter(({ isVisible }) => isVisible), [collectiblesList]);
};

export const useTezosTokenSelector = (): TokenInterface => {
  const balance = useSelectedAccountSelector().tezosBalance.data;

  return useMemo(() => getTezosToken(balance), [balance]);
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<WalletRootState, WalletState['addTokenSuggestion']>(({ wallet }) => wallet.addTokenSuggestion);

export const useIsShownDomainName = () =>
  useSelector<WalletRootState, WalletState['isShownDomainName']>(({ wallet }) => wallet.isShownDomainName);
