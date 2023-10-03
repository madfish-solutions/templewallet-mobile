import { useStorageMigration } from 'src/hooks/migration/useStorageMigration.hook';
import { useFirebaseApp } from 'src/hooks/use-firebase-app.hook';
import { usePushNotifications } from 'src/hooks/use-push-notifications';
import { useQuickActions } from 'src/hooks/use-quick-actions.hook';
import { useResetKeychainOnInstall } from 'src/hooks/use-reset-keychain-on-install.hook';
import { useResetLoading } from 'src/hooks/use-reset-loading.hook';
import { useStorageAnalytics } from 'src/hooks/use-storage-analytics';
import { useTokensMetadataFixtures } from 'src/hooks/use-tokens-metadata-fixtures';
import { useWhitelist } from 'src/hooks/use-whitelist.hook';

export const useRootHooks = () => {
  useStorageMigration();
  useStorageAnalytics();

  useTokensMetadataFixtures();
  useWhitelist();
  useQuickActions();
  useResetLoading();
  useResetKeychainOnInstall();

  useFirebaseApp();
  usePushNotifications();
};
