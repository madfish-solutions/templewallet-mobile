import React, { useEffect, useState } from 'react';

import { migrateLegacyAsyncStorageIfNeeded } from 'src/utils/legacy-async-storage-migration';

/**
 * Runs one-time legacy AsyncStorage migration (RKStorage → current) before loading the app,
 * so Redux persist rehydration sees migrated data after upgrading from async-storage 1.x.
 */
export const AppBootstrap: React.FC = () => {
  const [App, setApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    migrateLegacyAsyncStorageIfNeeded()
      .then(() => (cancelled ? null : import('./app')))
      .then(m => {
        if (!cancelled && m) setApp(() => m.App);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return App && <App />;
};
