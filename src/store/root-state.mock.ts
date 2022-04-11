import { mockBakingState } from './baking/baking-state.mock';
import { RootState } from './create-store';
import { mockCurrencyState } from './currency/currency-state.mock';
import { mockDAppsState } from './d-apps/d-apps-state.mock';
import { mockDebugState } from './debug/debug-state.mock';
import { mockSecurityState } from './security/security-state.mock';
import { mockSettingsState } from './settings/settings-state.mock';
import { mockWalletState } from './wallet/wallet-state.mock';

export const mockRootState: RootState = {
  wallet: mockWalletState,
  baking: mockBakingState,
  settings: mockSettingsState,
  security: mockSecurityState,
  dApps: mockDAppsState,
  currency: mockCurrencyState,
  debug: mockDebugState
};
