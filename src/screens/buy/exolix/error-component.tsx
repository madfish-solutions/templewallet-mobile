import React, { FC, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { ErrorDisclaimerMessage } from '../../../components/error-disclaimer-message/error-disclaimer-message';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { restartExolixTopupAction } from '../../../store/exolix/exolix-actions';
import { useExolixExchangeData } from '../../../store/exolix/exolix-selectors';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../utils/is-defined';
import { ExolixSelectors } from './exolix.selectors';
import { useExolixStyles } from './exolix.styles';

interface ErrorComponentProps {
  setIsError: (b: boolean) => void;
}

export const ErrorComponent: FC<ErrorComponentProps> = ({ setIsError }) => {
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();

  const styles = useExolixStyles();

  usePageAnalytic(ScreensEnum.Exolix, ExolixSelectors.TopupFirstStepTransactionOverdue);

  // TODO: swap-form copy formik

  const handleRestart = useCallback(() => {
    dispatch(restartExolixTopupAction());
    setIsError(false);
  }, [dispatch]);

  return (
    <>
      {isDefined(exchangeData) && (
        <>
          <View>
            <Text>
              Send the funds to the address below. As soon as the deposit is received, the exchange process will begin
              automatically
            </Text>
            <ErrorDisclaimerMessage title={'Transaction is overdue'}>
              <Text style={styles.description}>Please, create a new exchange unless</Text>
              <Text style={styles.description}>you have sent the funds.</Text>
              <Text style={styles.description}>If the funds have been sent, please, wait for the</Text>
              <Text style={styles.description}>confirmation from the system.</Text>
            </ErrorDisclaimerMessage>
          </View>
          <View>
            <Text>Transaction ID:</Text>
            <View>
              <Text>{exchangeData.id}</Text>
              {/* <CopyButton text={exchangeData.id} type="link">
                <CopyIcon
                  style={{ verticalAlign: 'inherit' }}
                  className={classNames('h-4 ml-1 w-auto inline', 'stroke-orange stroke-2')}
                  onClick={() => copy()}
                />
              </CopyButton> */}
            </View>
          </View>
        </>
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

// <View>
//   <Text>
//     The token exchange feature is provided by a third party. The Temple wallet is not responsible for the work of
//     third-party services.
//   </Text>
// </View>
