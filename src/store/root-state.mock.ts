import { mockAdvertisingState } from './advertising/advertising-state.mock';
import { mockBakingState } from './baking/baking-state.mock';
import { RootState } from './create-store';
import { mockCurrencyState } from './currency/currency-state.mock';
import { mockDAppsState } from './d-apps/d-apps-state.mock';
import { mockExolixState } from './exolix/exolix-state.mock';
import { mockMarketState } from './market/market-state.mock';
import { mockNotificationsState } from './notifications/notifications-state.mock';
import { mockRoute3State } from './route3/route3-state.mock';
import { mockSecurityState } from './security/security-state.mock';
import { mockSettingsState } from './settings/settings-state.mock';
import { mockTokensMetadataState } from './tokens-metadata/tokens-metadata-state.mock';
import { mockWalletState } from './wallet/wallet-state.mock';

export const mockRootState: RootState = {
  wallet: mockWalletState,
  tokensMetadata: mockTokensMetadataState,
  baking: mockBakingState,
  settings: mockSettingsState,
  security: mockSecurityState,
  dApps: mockDAppsState,
  currency: mockCurrencyState,
  exolix: mockExolixState,
  advertising: mockAdvertisingState,
  market: mockMarketState,
  notifications: mockNotificationsState,
  route3: mockRoute3State
};
