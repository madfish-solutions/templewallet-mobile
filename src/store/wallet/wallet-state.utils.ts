import { VisibilityEnum } from '../../enums/visibility.enum';
import {
  initialWalletAccountState,
  WalletAccountStateInterface
} from '../../interfaces/wallet-account-state.interface';
import { AccountTokenInterface } from '../../token/interfaces/account-token.interface';
import { isDefined } from '../../utils/is-defined';
import { WalletState } from './wallet-state';

const MAX_PENDING_OPERATION_DISPLAY_TIME = 4 * 3600000;

export const isPendingOperationOutdated = (addedAt: number) => {
  const currentTime = new Date().getTime();

  return currentTime - addedAt > MAX_PENDING_OPERATION_DISPLAY_TIME;
};

export const updateCurrentAccountState = (
  state: WalletState,
  updateFn: (currentAccount: WalletAccountStateInterface) => Partial<WalletAccountStateInterface>
): WalletState => updateAccountState(state, state.selectedAccountPublicKeyHash, updateFn);

export const updateAccountState = (
  state: WalletState,
  accountPublicKeyHash: string,
  updateFn: (currentAccount: WalletAccountStateInterface) => Partial<WalletAccountStateInterface>
): WalletState => ({
  ...state,
  accounts: state.accounts.map(account =>
    account.publicKeyHash === accountPublicKeyHash
      ? { ...account, ...updateFn({ ...initialWalletAccountState, ...account }) }
      : account
  )
});

export const pushOrUpdateTokensBalances = (
  initialTokensList: AccountTokenInterface[],
  balances: Record<string, string>
) => {
  const localBalances: Record<string, string> = { ...balances };
  const result: AccountTokenInterface[] = [];

  for (const token of initialTokensList) {
    const balance = localBalances[token.slug];
    if (isDefined(balance)) {
      result.push({ ...token, balance });

      delete localBalances[token.slug];
    } else {
      result.push(token);
    }
  }

  result.push(
    ...Object.entries(localBalances).map(([slug, balance]) => ({ slug, balance, visibility: VisibilityEnum.Visible }))
  );

  return result;
};

export const toggleTokenVisibility = (tokensList: AccountTokenInterface[], slug: string) => {
  const result: AccountTokenInterface[] = [];

  for (const token of tokensList) {
    if (token.slug === slug) {
      result.push({
        ...token,
        visibility: token.visibility === VisibilityEnum.Visible ? VisibilityEnum.Hided : VisibilityEnum.Visible
      });
    } else {
      result.push(token);
    }
  }

  return result;
};
