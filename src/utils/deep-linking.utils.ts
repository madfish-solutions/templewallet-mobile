import { Serializer } from '@airgap/beacon-sdk';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { URL } from 'react-native-url-polyfill';

import { BeaconHandler, isBeaconMessage } from '../beacon/beacon-handler';
import { isDefined } from './is-defined';

export const deepLinkHandler = async (url: string) => {
  try {
    const searchParams = new URL(url).searchParams;
    const type = searchParams.get('type');
    const data = searchParams.get('data');

    if (type === 'tzip10' && isDefined(data)) {
      const json = await new Serializer().deserialize(data);
      if (isBeaconMessage(json)) {
        await BeaconHandler.addPeer(json);
      }
    }
  } catch {}
};

export const useDeepLink = () => {
  useEffect(() => {
    const listener = ({ url }: { url: string }) => deepLinkHandler(url);

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, []);
};
