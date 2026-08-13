import { Serializer } from '@tezos-x/octez.connect-sdk';
import { useEffect } from 'react';
import { EmitterSubscription, Linking } from 'react-native';

import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isWalletConnectPairing, WALLETCONNECT_NOT_SUPPORTED_MESSAGE } from 'src/utils/beacon.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { getUrlQueryParams } from 'src/utils/url.utils';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigateToModal, useNavigation } from '../navigator/hooks/use-navigation.hook';
import { showErrorToast } from '../toast/toast.utils';
import { isDefined } from '../utils/is-defined';

import { BeaconHandler, isBeaconMessage } from './beacon-handler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const beaconDeepLinkHandler = async (url: string | null, onValidDataCallback: EmptyFn, onError: SyncFn<any>) => {
  try {
    const searchParams = getUrlQueryParams(url ?? '');
    const type = searchParams.get('type');
    const data = searchParams.get('data');

    if (type === 'tzip10' && isDefined(data)) {
      const json = await new Serializer().deserialize(data);

      if (isWalletConnectPairing(json)) {
        showErrorToast({ description: WALLETCONNECT_NOT_SUPPORTED_MESSAGE });

        return;
      }

      if (!isBeaconMessage(json)) {
        return;
      }

      onValidDataCallback();
      await BeaconHandler.addPeer(json).catch(error => {
        onError(error);
      });
    }
  } catch {}
};

export const useBeaconHandler = () => {
  const { trackErrorEvent } = useAnalytics();
  const navigateToModal = useNavigateToModal();
  const { goBack } = useNavigation();

  useEffect(() => {
    const listener = ({ url }: { url: string | null }) =>
      beaconDeepLinkHandler(
        url ?? '',
        () =>
          navigateToModal(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.DAppOperations,
            message: null,
            loading: true
          }),
        error => {
          goBack();
          trackErrorEvent('BeaconHandlerError', error, [], { url });
          showErrorToast({
            description: `Failed to connect to Beacon: ${JSON.stringify(error)}`,
            isCopyButtonVisible: true,
            onPress: () => copyStringToClipboard(JSON.stringify(error))
          });
        }
      );

    let emitter: EmitterSubscription;

    BeaconHandler.init(message =>
      navigateToModal(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message })
    ).then(() => {
      emitter = Linking.addEventListener('url', listener);
      Linking.getInitialURL().then(url => listener({ url }));
    });

    return () => (isDefined(emitter) ? emitter.remove() : undefined);
  }, []);
};
