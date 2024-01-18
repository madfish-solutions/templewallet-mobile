import { useCollectiblesDetailsLoading } from './use-collectibles-details-loading';
import { useFirebaseApp } from './use-firebase-app';
import { usePushNotifications } from './use-push-notifications';
import { useQuickActions } from './use-quick-actions';
import { useResetKeychainOnInstall } from './use-reset-keychain-on-install';
import { useResetLoading } from './use-reset-loading';
import { useStorageAnalytics } from './use-storage-analytics';
import { useWhitelistLoading } from './use-whitelist-loading';

export const useRootHooks = () => {
  useStorageAnalytics();

  useWhitelistLoading();
  useCollectiblesDetailsLoading();
  useQuickActions();
  useResetLoading();
  useResetKeychainOnInstall();

  useFirebaseApp();
  usePushNotifications();
};
