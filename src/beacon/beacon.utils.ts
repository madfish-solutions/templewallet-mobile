import { Serializer } from '@airgap/beacon-sdk';
import { URL } from 'react-native-url-polyfill';

import { isDefined } from '../utils/is-defined';
import { BeaconHandler, isBeaconMessage } from './beacon-handler';

export const tezosDeepLinkHandler = async (url: string) => {
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
