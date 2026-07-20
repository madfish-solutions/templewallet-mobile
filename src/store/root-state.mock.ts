import { mockABTestingState } from './ab-testing/ab-testing-state.mock';
import { mockAdvertisingState } from './advertising/advertising-state.mock';
import { mockBakingState } from './baking/baking-state.mock';
import { mockBuyWithCreditCardState } from './buy-with-credit-card/state.mock';
import { mockCollectiblesState } from './collectibles/collectibles-state.mock';
import { collectionsMockState } from './collectons/collections-state.mock';
import { mockContactBookState } from './contact-book/contact-book-state.mock';
import { mockCurrencyState } from './currency/currency-state.mock';
import { mockDAppsState } from './d-apps/d-apps-state.mock';
import { mockEvmAssetsState } from './evm/assets/evm-assets-state.mock';
import { mockEvmBalancesState } from './evm/balances/evm-balances-state.mock';
import { mockEvmCollectiblesMetadataState } from './evm/collectibles-metadata/evm-collectibles-metadata-state.mock';
import { mockEvmExchangeRatesState } from './evm/exchange-rates/evm-exchange-rates-state.mock';
import { mockEvmTokensMetadataState } from './evm/tokens-metadata/evm-tokens-metadata-state.mock';
import { mockExolixState } from './exolix/exolix-state.mock';
import { mockFarmsState } from './farms/state.mock';
import { mockMarketState } from './market/market-state.mock';
import { mockNewsletterState } from './newsletter/newsletter-state.mock';
import { mockNotificationsState } from './notifications/notifications-state.mock';
import { mockPartnersPromotionState } from './partners-promotion/partners-promotion-state.mock';
import { saplingInitialState } from './sapling/sapling-state';
import { mockSavingsState } from './savings/state.mock';
import { mockSecurityState } from './security/security-state.mock';
import { mockSettingsState } from './settings/settings-state.mock';
import { mockSwapState } from './swap/swap-state.mock';
import { mockTokensMetadataState } from './tokens-metadata/tokens-metadata-state.mock';
import type { RootState } from './types';
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
  swap: mockSwapState,
  contactBook: mockContactBookState,
  collections: collectionsMockState,
  buyWithCreditCard: mockBuyWithCreditCardState,
  partnersPromotion: mockPartnersPromotionState,
  abTesting: mockABTestingState,
  collectibles: mockCollectiblesState,
  farms: mockFarmsState,
  savings: mockSavingsState,
  newsletter: mockNewsletterState,
  sapling: saplingInitialState,
  evmAssets: mockEvmAssetsState,
  evmBalances: mockEvmBalancesState,
  evmTokensMetadata: mockEvmTokensMetadataState,
  evmCollectiblesMetadata: mockEvmCollectiblesMetadataState,
  evmExchangeRates: mockEvmExchangeRatesState
};
