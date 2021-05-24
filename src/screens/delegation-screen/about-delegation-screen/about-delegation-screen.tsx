import React from 'react';
import { Text, View } from 'react-native';

import { ButtonDelegatePrimary } from '../../../components/button/button-large/button-delegate-primary/button-delegate-primary';
import { ButtonsContainer } from '../../../components/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { formatSize } from '../../../styles/format-size';
import { useAboutDelegationScreenStyles } from './about-delegation-screen.styles';

export const AboutDelegationScreen = () => {
  const styles = useAboutDelegationScreenStyles();

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        <Text style={styles.title}>What is Tezos delegation?</Text>
        <Divider height={formatSize(8)} />
        <Text style={styles.text}>
          {
            "How to delegate your tokens to the Baker?\nIf you have XTZ tokens but you don't want to launch your node, you can delegate your XTZ tokens to Bakers with an already running node to get rewards from the mining based on your contribution. \n\nDelegation is the right and opportunity of every member of the Tezos network to transfer their vote in the form of XTZ tokens to other Bakers. Delegated funds are not frozen and are not moved anywhere. They remain in your wallet, and you can spend them or change Baker at any time. \n\nThe delegation system is also part of the LPoS consensus and allows users to be involved in supporting the network. Also, delegation helps significantly speed up transactions, makes them cheap, creates the basis for network scaling, and brings a passive income for delegators. \n\nDelegation is the in-build function of the Temple Wallet.\n\n"
          }
        </Text>
        <Divider height={formatSize(8)} />
        <Text style={styles.text}>Full guide “How to Delegate XTZ” by link below</Text>
        <Divider height={formatSize(8)} />
        <Text style={styles.link}>
          https://www.madfish.solutions/blog/how-to-choose-a-delegate-with-the-temple-wallet/
        </Text>
        <Divider height={formatSize(8)} />
        <Text style={styles.text}>
          In case you have any questions, write them in our communities: <Text
          style={styles.link}>telegram</Text> or{' '}
          <Text style={styles.link}>discord</Text>.
        </Text>
      </View>

      <ButtonsContainer>
        <ButtonDelegatePrimary title="Delegate" onPress={() => null} />
      </ButtonsContainer>
    </ScreenContainer>
  );
};
