import { useCollectiblesDetailsLoading } from './use-collectibles-details-loading';
import { useFirebaseApp } from './use-firebase-app';
import { usePushNotifications } from './use-push-notifications';
import { useQuickActions } from './use-quick-actions';
import { useResetKeychainOnInstall } from './use-reset-keychain-on-install';
import { useResetPermanentInitialSettings } from './use-reset-permanent-initial-settings';
import { useScamlistLoading } from './use-scamlist-loading';
import { useStorageAnalytics } from './use-storage-analytics';
import { useSwapTokensLoading } from './use-swap-tokens-loading';
import { useWhitelistLoading } from './use-whitelist-loading';

export const useRootHooks = () => {
  useStorageAnalytics();

  useWhitelistLoading();
  useScamlistLoading();
  useSwapTokensLoading();
  useCollectiblesDetailsLoading();
  useQuickActions();
  useResetPermanentInitialSettings();
  useResetKeychainOnInstall();

  useFirebaseApp();
  usePushNotifications();
};
