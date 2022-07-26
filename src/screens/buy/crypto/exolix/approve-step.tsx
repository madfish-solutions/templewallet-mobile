import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

import { ButtonMedium } from '../../../../components/button/button-medium/button-medium';
import { ButtonsFloatingContainer } from '../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { BlackTextLink } from '../../../../components/text-link/black-text-link';
import { ExchangeDataStatusEnum } from '../../../../interfaces/exolix.interface';
import { restartExolixTopupAction, setExolixStepAction } from '../../../../store/exolix/exolix-actions';
import { useExolixExchangeData, useExolixStep } from '../../../../store/exolix/exolix-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../../utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from '../../../../utils/clipboard.utils';
import { truncateLongAddress } from '../../../../utils/exolix.util';
import { isDefined } from '../../../../utils/is-defined';
import { openUrl } from '../../../../utils/linking.util';
import { Countdown } from '../../components/countdown/countdown';
import { EXOLIX_CONTACT_LINK } from './config';
import { ErrorComponent } from './error-component';
import { ExolixSelectors } from './exolix.selectors';
import { useExolixStyles } from './exolix.styles';
import useTopUpUpdate from './use-topup-update.hook';

interface ApproveStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

const FORTY_FIVE_MINUTES_IN_MS = 45 * 60 * 1000;

export const ApproveStep: FC<ApproveStepProps> = ({ isError, setIsError }) => {
  const styles = useExolixStyles();
  const step = useExolixStep();
  const colors = useColors();
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();
  const [showQr, setShowQr] = useState(false);

  const { trackEvent } = useAnalytics();

  const handleTrackSupportSubmit = useCallback(() => {
    return trackEvent(ExolixSelectors.TopupSecondStepSupport, AnalyticsEventCategory.ButtonPress);
  }, [step, trackEvent]);

  useTopUpUpdate(setIsError);

  useEffect(() => {
    if (isDefined(exchangeData)) {
      if (exchangeData.status === ExchangeDataStatusEnum.CONFIRMATION) {
        dispatch(setExolixStepAction(2));
      }
      if (exchangeData.status === ExchangeDataStatusEnum.EXCHANGING) {
        dispatch(setExolixStepAction(3));
      }
      if (exchangeData.status === ExchangeDataStatusEnum.OVERDUE) {
        setIsError(true);
      }
    }
  }, [exchangeData, dispatch, setIsError]);

  const handleCopyAddressPress = () => copyStringToClipboard(exchangeData?.depositAddress);
  const handleCopyTransactionPress = () => copyStringToClipboard(exchangeData?.id);

  return (
    <>
      {!isError && isDefined(exchangeData) ? (
        <ScreenContainer isFullScreenMode>
          <Divider size={formatSize(16)} />
          <View style={styles.header}>
            <Text style={styles.headerText}>Send the funds to the address below.</Text>
            <Text style={styles.headerText}>As soon as the deposit is received,</Text>
            <Text style={styles.headerText}>the exchange process will begin automatically</Text>
          </View>
          <Divider size={formatSize(16)} />
          <View>
            <Countdown endTimestamp={new Date(exchangeData.createdAt).getTime() + FORTY_FIVE_MINUTES_IN_MS} />
          </View>
          <Divider size={formatSize(16)} />
          <Disclaimer
            title="Important"
            texts={[
              'You need to send the exact amount of',
              'cryptocurrency to the deposit address.',
              'Otherwise the transaction will fail and you will',
              'have to contact Support'
            ]}
          >
            <View>
              <Text style={styles.disclaimerText}>You need to send the exact amount of</Text>
              <Text style={styles.disclaimerText}>cryptocurrency to the deposit address.</Text>
              <Text style={styles.disclaimerText}>Otherwise the transaction will fail and you will</Text>
              <View style={styles.disclaimerRow}>
                <Text style={styles.disclaimerText}>have to contact </Text>
                <BlackTextLink url={EXOLIX_CONTACT_LINK}>Support</BlackTextLink>
              </View>
            </View>
          </Disclaimer>
          <Divider size={formatSize(16)} />
          <View>
            <View style={styles.footerContainer}>
              <Text style={styles.infoText}>Send by one transaction</Text>
              <Text style={styles.textValue}>
                {exchangeData.amount} {exchangeData.coinFrom.coinCode}
              </Text>
            </View>
            <Divider size={formatSize(8)} />
            <View style={styles.footerContainer}>
              <Text style={styles.infoText}>You get</Text>
              <Text style={styles.textValue}>
                {exchangeData.amountTo} {exchangeData.coinTo.coinCode}
              </Text>
            </View>
            <Divider size={formatSize(8)} />
            <View style={styles.footerContainer}>
              <Text style={styles.infoText}>Fixed rate</Text>
              <Text style={styles.textValue}>
                1 {exchangeData.coinFrom.coinCode} ≈ {exchangeData.rate} {exchangeData.coinTo.coinCode}
              </Text>
            </View>
            <Divider size={formatSize(8)} />
            <View style={styles.footerContainer}>
              <Text style={styles.infoText}>Transaction ID:</Text>
              <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyTransactionPress}>
                  <Text style={styles.publicKeyHash}>{exchangeData.id}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Divider size={formatSize(8)} />
          <ButtonsFloatingContainer />
          <View style={styles.rowCenterContainer}>
            <Text style={styles.depositText}>Deposit {exchangeData.coinFrom.networkName} address:</Text>
          </View>
          <Divider size={formatSize(8)} />
          <TouchableOpacity style={styles.addressContainer} onPress={handleCopyTransactionPress}>
            <Text style={styles.publicKeyHash}>{exchangeData.depositAddress}</Text>
          </TouchableOpacity>
          <Divider size={formatSize(8)} />
          <View style={styles.rowCenterContainer}>
            <View style={styles.buttonsContainer}>
              <ButtonMedium title="COPY" iconName={IconNameEnum.CopyBold} onPress={handleCopyAddressPress} />
            </View>
            <Divider size={formatSize(8)} />
            <View style={styles.buttonsContainer}>
              <ButtonMedium title="QR CODE" iconName={IconNameEnum.QrScannerBold} onPress={() => setShowQr(!showQr)} />
            </View>
          </View>
          <Divider size={formatSize(16)} />
          {showQr && (
            <>
              <View style={styles.rowCenterContainer}>
                <QRCode
                  value={exchangeData.depositAddress}
                  ecl="Q"
                  size={formatSize(180)}
                  color={colors.black}
                  backgroundColor={colors.pageBG}
                />
              </View>
              <Divider size={formatSize(16)} />
            </>
          )}
          <ButtonsFloatingContainer />
          <Divider size={formatSize(8)} />
          <View style={styles.footerContainer}>
            <Text style={styles.infoText}>Recepient address</Text>
            <TouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyTransactionPress}>
              <Text style={styles.publicKeyHash}>{truncateLongAddress(exchangeData.withdrawalAddress)}</Text>
            </TouchableOpacity>
          </View>
          <Divider size={formatSize(16)} />
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              dispatch(restartExolixTopupAction());
            }}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
          <Divider size={formatSize(16)} />
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              handleTrackSupportSubmit();
              openUrl(EXOLIX_CONTACT_LINK);
            }}
          >
            <Text style={styles.actionsContainer}>SUPPORT</Text>
          </TouchableOpacity>
        </ScreenContainer>
      ) : !isDefined(exchangeData) ? (
        <Text>Loading</Text>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
