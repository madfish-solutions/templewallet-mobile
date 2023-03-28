import React from 'react';
import { View } from 'react-native';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { BuySelectors } from './buy.selectors';
import { useBuyStyles } from './buy.styles';
import { TopUpOption } from './components/top-up-option/top-up-option';

export const Buy = () => {
  const { metadata } = useNetworkInfo();
  const styles = useBuyStyles();
  const { navigate } = useNavigation();

  usePageAnalytic(ScreensEnum.Buy);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.optionsContainer}>
        <TopUpOption
          title="Buy with Crypto"
          iconName={IconNameEnum.BuyWithCrypto}
          testID={BuySelectors.buyWithCrypto}
          onPress={() => navigate(ScreensEnum.Exolix)}
        />
        <TopUpOption
          title="Buy with Debit/Credit Card"
          iconName={IconNameEnum.CreditCard}
          testID={BuySelectors.buyWithCreditCard}
          onPress={() => navigate(ScreensEnum.BuyWithCreditCard)}
        />
      </View>
      <Disclaimer
        title="Disclaimer"
        texts={[
          `Temple integrated third-party solutions to buy ${metadata.symbol} with crypto or a Debit/Credit card.`
        ]}
      />
    </ScreenContainer>
  );
};
