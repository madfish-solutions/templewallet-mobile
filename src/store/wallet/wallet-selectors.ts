import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AccountTypeEnum } from '../../enums/account-type.enum';
import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountStateInterface } from '../../interfaces/account-state.interface';
import { AccountInterface } from '../../interfaces/account.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { isCollectible, isNonZeroBalance } from '../../utils/tezos.util';
import { getTokenMetadata } from '../../utils/token-metadata.utils';
import { getAccountState, getSelectedAccount } from '../../utils/wallet-account-state.utils';
import { useTezosToken } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
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
  useSelector<WalletRootState, AccountInterface>(
    ({ wallet }) => getSelectedAccount(wallet),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useAssetsListSelector = (): TokenInterface[] =>
  useSelector<RootState, TokenInterface[]>(
    state => {
      const selectedAccountState = getAccountState(state.wallet, state.wallet.selectedAccountPublicKeyHash);

      return selectedAccountState.tokensList
        .filter(item => selectedAccountState.removedTokensList.indexOf(item.slug) === -1)
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
    },
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

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

  return useTezosToken(tezosBalance);
};

export const useSelectedAccountTezosTokenSelector = () => {
  const selectedAccountPublicKeyHash = useSelector<WalletRootState, WalletState['selectedAccountPublicKeyHash']>(
    ({ wallet }) => wallet.selectedAccountPublicKeyHash
  );

  return useTezosTokenSelector(selectedAccountPublicKeyHash);
};
