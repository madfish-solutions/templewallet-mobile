import { Serializer } from '@airgap/beacon-sdk';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { URL } from 'react-native-url-polyfill';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { isDefined } from '../utils/is-defined';
import { BeaconHandler, isBeaconMessage } from './beacon-handler';

export const useBeaconHandler = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    BeaconHandler.init(message =>
      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message })
    );

    const listener = async ({ url }: { url: string }) => {
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

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, []);
};
