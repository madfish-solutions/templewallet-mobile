import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../../../components/divider/divider';
import { ErrorDisclaimerMessage } from '../../../../../components/error-disclaimer-message/error-disclaimer-message';
import { ScreenContainer } from '../../../../../components/screen-container/screen-container';
import { ScreensEnum } from '../../../../../navigator/enums/screens.enum';
import { restartExolixTopupAction } from '../../../../../store/exolix/exolix-actions';
import { useExolixExchangeData } from '../../../../../store/exolix/exolix-selectors';
import { formatSize } from '../../../../../styles/format-size';
import { usePageAnalytic } from '../../../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../../../utils/is-defined';
import { openUrl } from '../../../../../utils/linking.util';
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
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                handleTrackSupportSubmit();
                openUrl(EXOLIX_CONTACT_LINK);
              }}
            >
              <Text style={styles.actionsContainer}>SUPPORT</Text>
            </TouchableOpacity>
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
