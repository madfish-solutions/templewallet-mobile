import { Serializer } from '@airgap/beacon-sdk';
import { useEffect } from 'react';
import { EmitterSubscription, Linking } from 'react-native';

import { getUrlQueryParams } from 'src/utils/url.utils';

import { EmptyFn, EventFn } from '../config/general';
import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { showErrorToast } from '../toast/toast.utils';
import { isDefined } from '../utils/is-defined';

import { BeaconHandler, isBeaconMessage } from './beacon-handler';

export const beaconDeepLinkHandler = async (
  url: string | null,
  onValidDataCallback: EmptyFn,
  onError: EventFn<string>
) => {
  try {
    const searchParams = getUrlQueryParams(url ?? '');
    const type = searchParams.get('type');
    const data = searchParams.get('data');

    if (type === 'tzip10' && isDefined(data)) {
      onValidDataCallback();
      const json = await new Serializer().deserialize(data);
      if (isBeaconMessage(json)) {
        await BeaconHandler.addPeer(json).catch(error => {
          onError(error.toString());
        });
      }
    }
  } catch {}
};

export const useBeaconHandler = () => {
  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    const listener = ({ url }: { url: string | null }) =>
      beaconDeepLinkHandler(
        url ?? '',
        () =>
          navigate(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.DAppOperations,
            message: null,
            loading: true
          }),
        errorMessage => {
          goBack();
          showErrorToast({ description: errorMessage });
        }
      );

    let emitter: EmitterSubscription;

    BeaconHandler.init(message =>
      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message })
    ).then(() => {
      emitter = Linking.addEventListener('url', listener);
      Linking.getInitialURL().then(url => listener({ url }));
    });

    return () => (isDefined(emitter) ? emitter.remove() : undefined);
  }, []);
};
