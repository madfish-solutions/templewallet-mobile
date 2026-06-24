import React, { useCallback } from 'react';
import { View } from 'react-native';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { BuySelectors } from './buy.selectors';
import { useBuyStyles } from './buy.styles';
import { TopUpOption } from './components/top-up-option/top-up-option';

export const Buy = () => {
  const styles = useBuyStyles();
  const navigateToScreen = useNavigateToScreen();

  usePageAnalytic(ScreensEnum.Buy);

  const handleBuyWithCryptoPress = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.Exolix }),
    [navigateToScreen]
  );
  const handleBuyWithFiatPress = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.BuyWithCreditCard }),
    [navigateToScreen]
  );

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.optionsContainer}>
        <TopUpOption
          title="Buy with Crypto"
          iconName={IconNameEnum.BuyWithCrypto}
          testID={BuySelectors.buyWithCrypto}
          onPress={handleBuyWithCryptoPress}
        />
        <TopUpOption
          title="Buy with Debit/Credit Card"
          iconName={IconNameEnum.CreditCard}
          testID={BuySelectors.buyWithCreditCard}
          onPress={handleBuyWithFiatPress}
        />
      </View>
      <Disclaimer
        title="Disclaimer"
        texts={[
          `Temple integrated third-party solutions to buy ${TEZ_TOKEN_METADATA.symbol} or other tokens with cryptocurrencies or Debit/Credit cards.`
        ]}
      />
    </ScreenContainer>
  );
};
