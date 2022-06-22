import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountStateInterface, initialAccountState } from '../../interfaces/account-state.interface';
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
  updateFn: (currentAccountState: AccountStateInterface) => Partial<AccountStateInterface>
): WalletState => updateAccountState(state, state.selectedAccountPublicKeyHash, updateFn);

export const updateAccountState = (
  state: WalletState,
  accountPublicKeyHash: string,
  updateFn: (accountState: AccountStateInterface) => Partial<AccountStateInterface>
): WalletState => {
  const accountState = state.accountsStateRecord[accountPublicKeyHash];

  return {
    ...state,
    accountsStateRecord: {
      ...state.accountsStateRecord,
      [accountPublicKeyHash]: {
        ...accountState,
        ...updateFn({ ...initialAccountState, ...accountState })
      }
    }
  };
};

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
        visibility: token.visibility === VisibilityEnum.Visible ? VisibilityEnum.Hidden : VisibilityEnum.Visible
      });
    } else {
      result.push(token);
    }
  }

  return result;
};
