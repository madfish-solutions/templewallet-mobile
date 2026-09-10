import React, { useCallback } from 'react';

import { beaconDeepLinkHandler } from 'src/beacon/use-beacon-handler.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isBeaconPayload } from 'src/utils/beacon.utils';
import { isValidAddress } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ScanQrCodeAnalyticsEvents } from './analytics-events';
import { QrCodeScanner } from './qr-code-scanner';

export const ScanQrCode = () => {
  const navigateToModal = useNavigateToModal();
  const { goBack } = useNavigation();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const { trackEvent } = useAnalytics();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = useCallback(
    (data: string) => {
      goBack();

      if (isValidAddress(data)) {
        if (Number(tezosToken.balance) > 0) {
          navigateToModal(ModalsEnum.Send, { token: TEZ_TOKEN_METADATA, receiverPublicKeyHash: data });
        } else {
          trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_ZERO_BALANCE, AnalyticsEventCategory.General);
          showErrorToast({ description: `You need to have ${TEZ_TOKEN_METADATA.symbol} to pay gas fee` });
        }

        return;
      }

      if (isBeaconPayload(data)) {
        let dataWasIgnored = true;
        beaconDeepLinkHandler(
          data,
          () => {
            dataWasIgnored = false;
            navigateToModal(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.DAppOperations,
              message: null,
              loading: true
            });
          },
          errorMessage => {
            dataWasIgnored = false;
            goBack();
            trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_HANDLE_ERROR, AnalyticsEventCategory.General, {
              errorMessage
            });
            showErrorToast({ description: errorMessage });
          }
        );
        if (dataWasIgnored) {
          trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_DATA_IGNORED, AnalyticsEventCategory.General, { data });
        }

        return;
      }

      trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_INVALID_QR_CODE, AnalyticsEventCategory.General);
      showErrorToast({ description: 'Invalid QR code' });
    },
    [goBack, navigateToModal, tezosToken.balance, trackEvent]
  );

  return <QrCodeScanner onQrCodeRead={handleRead} />;
};
