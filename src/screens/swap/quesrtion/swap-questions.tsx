import React, { FC } from 'react';
import { View } from 'react-native';

import { Disclaimer } from '../../../components/disclaimer/disclaimer';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { useSwapQuestionsStyles } from './swap-questions.styles';

export const SwapQuestionsScreen: FC = () => {
  const styles = useSwapQuestionsStyles();

  usePageAnalytic(ScreensEnum.SwapQuestionsScreen);

  return (
    <View style={styles.contentWrapper}>
      <Disclaimer
        title="Disclaimer."
        texts={[
          'Temple wallet only provides an interface to interact with the Tezos DEXes.\n',
          'We are not responsible for: \n • issues \n • displayed tokens \n • price \n • exchange rates \n • user trading decisions\n',
          'Before using Swap Section, you shold review the relevant documentation to understand how the DEX(AMM) protocols work.\n',
          'Using this section is solely the user’s responsibility.'
        ]}
      />
    </View>
  );
};
