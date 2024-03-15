import { useCollectiblesDetailsLoading } from './use-collectibles-details-loading';
import { useFirebaseApp } from './use-firebase-app';
import { usePushNotifications } from './use-push-notifications';
import { useQuickActions } from './use-quick-actions';
import { useResetKeychainOnInstall } from './use-reset-keychain-on-install';
import { useResetLoading } from './use-reset-loading';
import { useResetOnRampOverlay } from './use-reset-on-ramp-overlay';
import { useScamlistLoading } from './use-scamlist-loading';
import { useStorageAnalytics } from './use-storage-analytics';
import { useWhitelistLoading } from './use-whitelist-loading';

export const useRootHooks = () => {
  useStorageAnalytics();

  useWhitelistLoading();
  useScamlistLoading();
  useCollectiblesDetailsLoading();
  useQuickActions();
  useResetLoading();
  useResetKeychainOnInstall();

  useFirebaseApp();
  usePushNotifications();

  useResetOnRampOverlay();
};
