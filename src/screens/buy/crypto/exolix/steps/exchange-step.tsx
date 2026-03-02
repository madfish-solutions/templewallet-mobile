import React, { FC, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { restartExolixTopupAction, setExolixStepAction } from 'src/store/exolix/exolix-actions';
import { useExolixExchangeData, useExolixStep } from 'src/store/exolix/exolix-selectors';
import { formatSize } from 'src/styles/format-size';
import { ExchangeDataStatusEnum } from 'src/types/exolix.types';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { CopyRow } from '../components/copy-row';
import { ErrorComponent } from '../components/error-component';
import { EXOLIX_CONTACT_LINK } from '../config';
import { ExolixSelectors } from '../exolix.selectors';
import { useExolixStyles } from '../exolix.styles';
import { useSupportTrack } from '../hooks/use-support-track.hook';
import useTopUpUpdate from '../hooks/use-topup-update.hook';

interface ExchangeStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const ExchangeStep: FC<ExchangeStepProps> = ({ isError, setIsError }) => {
  const styles = useExolixStyles();
  const step = useExolixStep();
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();

  const handleTrackSupportSubmit = useSupportTrack();

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
              {step < 3 ? (
                <View style={styles.header}>
                  <Text style={styles.headerText}>Please, wait. The convertation process will take from 15</Text>
                  <Text style={styles.headerText}>min to 2 hours.</Text>
                </View>
              ) : (
                <View style={styles.header}>
                  <Text style={styles.headerText}>Please, check your funds in your wallet.</Text>
                  <Text style={styles.headerText}>The exchange process is completed.</Text>
                </View>
              )}
              <Divider size={formatSize(16)} />
              {step < 3 ? (
                <>
                  <CopyRow title="Transaction ID" data={exchangeData.id} />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You send</Text>
                    <Text style={styles.textValue}>
                      {exchangeData.amount} {exchangeData.coinFrom.coinCode}
                    </Text>
                  </View>
                  <Divider size={formatSize(8)} />
                  <View style={styles.footerContainer}>
                    <Text style={styles.infoText}>You receive</Text>
                    <Text style={styles.textValue}>
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
                    <Text style={styles.textValue}>
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
                    <Text style={styles.textValue}>
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
                    <Text style={styles.textValue}>
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
              <SafeTouchableOpacity
                style={styles.textContainer}
                onPress={() => {
                  handleTrackSupportSubmit();
                  openUrl(EXOLIX_CONTACT_LINK);
                }}
              >
                <Text style={styles.actionsContainer}>SUPPORT</Text>
              </SafeTouchableOpacity>
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
        <Text style={styles.textValue}>Loading</Text>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
