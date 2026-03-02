import React, { FC, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { ErrorDisclaimerMessage } from 'src/components/error-disclaimer-message/error-disclaimer-message';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { restartExolixTopupAction } from 'src/store/exolix/exolix-actions';
import { useExolixExchangeData } from 'src/store/exolix/exolix-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { EXOLIX_CONTACT_LINK } from '../config';
import { ExolixSelectors } from '../exolix.selectors';
import { useExolixStyles } from '../exolix.styles';
import { useSupportTrack } from '../hooks/use-support-track.hook';

interface ErrorComponentProps {
  setIsError: (b: boolean) => void;
}

export const ErrorComponent: FC<ErrorComponentProps> = ({ setIsError }) => {
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();

  const styles = useExolixStyles();

  const handleTrackSupportSubmit = useSupportTrack();

  usePageAnalytic(ScreensEnum.Exolix, ExolixSelectors.TopupFirstStepTransactionOverdue);

  const handleRestart = useCallback(() => {
    dispatch(restartExolixTopupAction());
    setIsError(false);
  }, [dispatch]);

  return (
    <>
      {isDefined(exchangeData) && (
        <ScreenContainer>
          <View>
            <Divider size={formatSize(16)} />
            <View style={styles.header}>
              <Text style={styles.headerText}>Send the funds to the address below.</Text>
              <Text style={styles.headerText}>As soon as the deposit is received,</Text>
              <Text style={styles.headerText}>the exchange process will begin automatically</Text>
            </View>
            <Divider size={formatSize(16)} />
            <Divider size={formatSize(16)} />
            <ErrorDisclaimerMessage title={'Transaction is overdue'}>
              <Text style={styles.description}>Please, create a new exchange unless</Text>
              <Text style={styles.description}>you have sent the funds.</Text>
              <Text style={styles.description}>If the funds have been sent, please, wait for the</Text>
              <Text style={styles.description}>confirmation from the system.</Text>
            </ErrorDisclaimerMessage>
          </View>
          <Divider size={formatSize(16)} />
          <ButtonsFloatingContainer>
            <SafeTouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                handleTrackSupportSubmit();
                openUrl(EXOLIX_CONTACT_LINK);
              }}
            >
              <Text style={styles.actionsContainer}>SUPPORT</Text>
            </SafeTouchableOpacity>
          </ButtonsFloatingContainer>
          <ButtonsFloatingContainer />
        </ScreenContainer>
      )}
      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Top Up Again"
          onPress={handleRestart}
          testID={ExolixSelectors.TopupFirstStepSubmitAgain}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
