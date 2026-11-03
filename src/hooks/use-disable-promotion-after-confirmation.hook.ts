import { noop } from 'lodash-es';
import { useCallback, useState } from 'react';
import type { DialogButtonProps } from 'react-native-dialog/lib/Button';

import { PromotionItemSelectors } from 'src/components/image-promotion-view/selectors';
import { dispatch } from 'src/store';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

interface PromotionDialogButtonPropsFactoryInput {
  title: string;
  description: string;
  buttonsFn: (onConfirm: EmptyFn, onCancel: EmptyFn) => DialogButtonProps[];
  verticalButtons?: boolean;
}

const makePromotionDialogPropsFactory =
  ({ title, description, buttonsFn, verticalButtons }: PromotionDialogButtonPropsFactoryInput) =>
  (visible: boolean, onConfirm: EmptyFn, onCancel: EmptyFn) => ({
    visible,
    title,
    description,
    verticalButtons,
    onBackdropPress: onCancel,
    onRequestClose: onCancel,
    buttons: buttonsFn(onConfirm, onCancel)
  });

const makeEnablePromotionDialogProps = makePromotionDialogPropsFactory({
  title: 'Support the development team and earn tokens by viewing ads inside the wallet.',
  description:
    'To enable this feature, we request your permission to trace your Wallet Address and IP address. You can always disable ads in the settings.',
  buttonsFn: (onConfirm, onCancel) => [
    {
      label: 'Cancel',
      onPress: onCancel
    },
    {
      label: 'Enable',
      bold: true,
      onPress: onConfirm
    }
  ],
  verticalButtons: true
});

const makeDisablePromotionDialogProps = makePromotionDialogPropsFactory({
  title: 'Are you sure you want to disable all ads?',
  description:
    'Pay attention: you can receive rewards in TKEY tokens for viewing ads in our wallet. If you disabled Ads, you can always activate it in the settings.',
  buttonsFn: (onConfirm, onCancel) => [
    {
      label: 'Cancel',
      onPress: onCancel
    },
    {
      label: 'Disable',
      bold: true,
      onPress: onConfirm
    }
  ],
  verticalButtons: true
});

export const usePromotionAfterConfirmation = () => {
  const { trackEvent } = useAnalytics();
  const [dialogProps, setDialogProps] = useState(makeEnablePromotionDialogProps(false, noop, noop));

  const hideDialog = useCallback(() => setDialogProps(prevProps => ({ ...prevProps, visible: false })), []);
  const showDialog = useCallback(
    (dialogPropsFn: ReturnType<typeof makePromotionDialogPropsFactory>, onConfirm: EmptyFn, onCancel?: EmptyFn) =>
      setDialogProps(
        dialogPropsFn(
          true,
          () => {
            onConfirm();
            hideDialog();
          },
          () => {
            onCancel?.();
            hideDialog();
          }
        )
      ),
    [hideDialog]
  );

  const enablePromotion = useCallback(
    () => showDialog(makeEnablePromotionDialogProps, () => dispatch(togglePartnersPromotionAction(true))),
    [showDialog]
  );

  const disablePromotion = useCallback(
    () =>
      showDialog(
        makeDisablePromotionDialogProps,
        () => {
          trackEvent(PromotionItemSelectors.disableButton, AnalyticsEventCategory.ButtonPress);
          dispatch(togglePartnersPromotionAction(false));
        },
        () => trackEvent(PromotionItemSelectors.cancelButton, AnalyticsEventCategory.ButtonPress)
      ),
    [showDialog, trackEvent]
  );

  return { enablePromotion, disablePromotion, dialogProps };
};
