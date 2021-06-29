import { useEffect } from 'react';
import { Linking } from 'react-native';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { BeaconHandler } from './beacon-handler';
import { tezosDeepLinkHandler } from './beacon.utils';

export const useBeaconHandler = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    BeaconHandler.init(message =>
      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message })
    );

    const listener = async ({ url }: { url: string }) => tezosDeepLinkHandler(url);

    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, []);
};
