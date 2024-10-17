import React, { FC, ReactElement } from 'react';
import { Text, View } from 'react-native';

import { TokenInterface } from 'src/token/interfaces/token.interface';

import { TokenHeaderButton } from './token-header-button';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  historyComponent: ReactElement;
  token: TokenInterface;
  scam?: boolean;
}

export const TokenScreenContentContainer: FC<Props> = ({ historyComponent, token, scam }) => {
  const styles = useTokenScreenContentContainerStyles();

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>History</Text>
        <TokenHeaderButton token={token} scam={scam} />
      </View>

      {historyComponent}
    </>
  );
};
