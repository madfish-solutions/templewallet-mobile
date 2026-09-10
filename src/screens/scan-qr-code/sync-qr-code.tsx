import React, { useCallback } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isSyncPayload } from 'src/utils/sync.utils';

import { ScanQrCodeAnalyticsEvents } from './analytics-events';
import { QrCodeScanner } from './qr-code-scanner';

export const SyncQrCode = () => {
  const navigateToModal = useNavigateToModal();
  const { goBack } = useNavigation();
  const { trackEvent } = useAnalytics();

  usePageAnalytic(ScreensEnum.SyncQrCode);

  const handleRead = useCallback(
    (data: string) => {
      goBack();

      if (isSyncPayload(data)) {
        navigateToModal(ModalsEnum.ConfirmSync, { payload: data });

        return;
      }

      trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_INVALID_QR_CODE, AnalyticsEventCategory.General);
      showErrorToast({ description: 'Invalid QR code' });
    },
    [goBack, navigateToModal, trackEvent]
  );

  return <QrCodeScanner onQrCodeRead={handleRead} />;
};
