import React, { useEffect, useState } from 'react';
import { readFileAssets, MainBundlePath, readFile } from 'react-native-fs';

import { isAndroid } from 'src/config/system';
import { migrateLegacyAsyncStorageIfNeeded } from 'src/utils/legacy-async-storage-migration';
import { setSaplingParamsProvider } from 'src/utils/sapling/sapling-params-provider';

const readBundledBinary = (path: string) => {
  if (isAndroid) {
    return readFileAssets(`custom/${path}`, 'base64');
  }

  const absolutePath = `${MainBundlePath}/${path}`;

  return readFile(absolutePath, 'base64');
};

/**
 * Runs one-time legacy AsyncStorage migration (RKStorage → current) before loading the app,
 * so Redux persist rehydration sees migrated data after upgrading from async-storage 1.x.
 */
export const AppBootstrap: React.FC = () => {
  const [App, setApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setSaplingParamsProvider(async () => ({
      spend: {
        saplingSpendParams: await readBundledBinary('sapling-spend.params')
      },
      output: {
        saplingOutputParams: await readBundledBinary('sapling-output.params')
      }
    }));
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
