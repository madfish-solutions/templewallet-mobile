import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../components/divider/divider';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { ExchangeDataStatusEnum } from '../../../interfaces/exolix.interface';
import { restartExolixTopupAction, setExolixStepAction } from '../../../store/exolix/exolix-actions';
import { useExolixExchangeData, useExolixStep } from '../../../store/exolix/exolix-selectors';
import { formatSize } from '../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../utils/is-defined';
import { openUrl } from '../../../utils/linking.util';
import { EXOLIX_CONTACT_LINK } from './config';
import { CopyRow } from './copy-row';
import { ErrorComponent } from './error-component';
import { ExolixSelectors } from './exolix.selectors';
import { useExolixStyles } from './exolix.styles';
import useTopUpUpdate from './use-topup-update.hook';

interface ExchangeStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const ExchangeStep: FC<ExchangeStepProps> = ({ isError, setIsError }) => {
  const styles = useExolixStyles();
  const step = useExolixStep();
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();

  const { trackEvent } = useAnalytics();

  const handleTrackSupportSubmit = useCallback(() => {
    let event: ExolixSelectors;
    switch (step) {
      case 2:
        event = ExolixSelectors.TopupSecondStepSupport;
        break;
      case 3:
        event = ExolixSelectors.TopupThirdStepSupport;
        break;
      default:
        event = ExolixSelectors.TopupFourthStepSubmit;
        break;
    }

    return trackEvent(event, AnalyticsEventCategory.ButtonPress);
  }, [step, trackEvent]);

  useTopUpUpdate(setIsError);

  useEffect(() => {
    if (!exchangeData) {
      setIsError(true);

      return;
    }
    if (exchangeData.status === ExchangeDataStatusEnum.SUCCESS) {
      dispatch(setExolixStepAction(4));
    } else if (exchangeData.status === ExchangeDataStatusEnum.EXCHANGING) {
      dispatch(setExolixStepAction(3));
    } else if (exchangeData.status === ExchangeDataStatusEnum.OVERDUE) {
      setIsError(true);
    }
  }, [exchangeData, dispatch, step, setIsError]);

  const handleRestart = useCallback(() => {
    dispatch(restartExolixTopupAction());
    setIsError(false);
  }, [dispatch]);

  return (
    <>
      {!isError && isDefined(exchangeData) ? (
        <>
          <ScreenContainer>
            <View>
              <Divider size={formatSize(16)} />
              <View style={styles.header}>
                <Text style={styles.headerText}>Please, wait. The convertation process will take from 15</Text>
                <Text style={styles.headerText}>min to 2 hours.</Text>
              </View>
              <Divider size={formatSize(16)} />
              {step < 3 ? (
                <>
                  <CopyRow title="Transaction ID" data={exchangeData.id} />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You send</Text>
                    <Text>
                      {exchangeData.amount} {exchangeData.coinFrom.coinCode}
                    </Text>
                  </View>
                  <Divider size={formatSize(8)} />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You receive</Text>
                    <Text>
                      {exchangeData.amountTo} {exchangeData.coinTo.coinCode}
                    </Text>
                  </View>
                  <Divider size={formatSize(8)} />
                  <CopyRow
                    title={`Deposit ${exchangeData.coinFrom.coinCode} address`}
                    data={exchangeData.depositAddress}
                  />
                  <CopyRow title="Recepient address" data={exchangeData.withdrawalAddress} />
                </>
              ) : (
                <>
                  <CopyRow title="Transaction ID" data={exchangeData.id} />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>Sent time</Text>
                    <Text>
                      {new Date(exchangeData.createdAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You send</Text>
                    <Text>
                      {exchangeData.amount} {exchangeData.coinFrom.coinCode}
                    </Text>
                  </View>
                  <Divider size={formatSize(8)} />
                  <CopyRow title="Input hash" data={exchangeData.hashIn.hash} />
                  <CopyRow
                    title={`Deposit ${exchangeData.coinFrom.coinCode} address`}
                    data={exchangeData.depositAddress}
                  />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You receive</Text>
                    <Text>
                      {exchangeData.amountTo} {exchangeData.coinTo.coinCode}
                    </Text>
                  </View>
                  <Divider size={formatSize(8)} />
                  <CopyRow title="Output hash" data={exchangeData.hashOut.hash} />
                  <CopyRow title="Recepient address" data={exchangeData.withdrawalAddress} />
                </>
              )}
              <Divider size={formatSize(8)} />
              <ButtonsFloatingContainer />
              <TouchableOpacity
                style={styles.textContainer}
                onPress={() => {
                  handleTrackSupportSubmit();
                  openUrl(EXOLIX_CONTACT_LINK);
                }}
              >
                <Text style={styles.actionsContainer}>SUPPORT</Text>
              </TouchableOpacity>
              <Divider size={formatSize(16)} />
              <ButtonsFloatingContainer />
            </View>
          </ScreenContainer>
          {step > 2 && (
            <ButtonsFloatingContainer>
              <ButtonLargePrimary
                title="New Top Up"
                onPress={handleRestart}
                testID={ExolixSelectors.TopupFourthStepSubmit}
              />
            </ButtonsFloatingContainer>
          )}
        </>
      ) : !isDefined(exchangeData) ? (
        <Text>Loading</Text>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
