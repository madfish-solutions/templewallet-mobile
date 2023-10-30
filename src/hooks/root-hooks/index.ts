import { useFirebaseApp } from './use-firebase-app';
import { usePushNotifications } from './use-push-notifications';
import { useQuickActions } from './use-quick-actions';
import { useResetKeychainOnInstall } from './use-reset-keychain-on-install';
import { useResetLoading } from './use-reset-loading';
import { useShelterMigrations } from './use-shelter-migrations';
import { useStorageAnalytics } from './use-storage-analytics';
import { useStorageMigration } from './use-storage-migration';
import { useTokensMetadataFixtures } from './use-tokens-metadata-fixtures';
import { useWhitelistLoading } from './use-whitelist-loading';

export const useRootHooks = () => {
  useStorageMigration();
  useStorageAnalytics();

  useTokensMetadataFixtures();
  useWhitelistLoading();
  useQuickActions();
  useResetLoading();
  useResetKeychainOnInstall();

  useFirebaseApp();
  usePushNotifications();

  useShelterMigrations();
};
