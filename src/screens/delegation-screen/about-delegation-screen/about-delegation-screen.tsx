import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonDelegatePrimary } from '../../../components/button/button-large/button-delegate-primary/button-delegate-primary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { EmptyFn } from '../../../config/general';
import { delegationManual, discordUrl, redditUrl, telegramUrl, twitterUrl, youTubeUrl } from '../../../config/socials';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { SocialButton } from '../../settings/settings-header/social-button/social-button';
import { useAboutDelegationScreenStyles } from './about-delegation-screen.styles';

interface Props {
  onDelegatePress: EmptyFn;
}

export const AboutDelegationScreen: FC<Props> = ({ onDelegatePress }) => {
  const styles = useAboutDelegationScreenStyles();
  const { blue } = useColors();

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.content}>
        <Divider size={formatSize(8)} />
        <Icon name={IconNameEnum.Deal} size={formatSize(64)} color={blue} />
        <Divider size={formatSize(16)} />
        <Text style={styles.title}>
          Delegate your Tezos in this section and earn 5-6% annually from Baking rewards.
        </Text>
        <Divider size={formatSize(16)} />
        <Text style={styles.text}>
          {
            'Delegation is part of the Tezos Liquid Proof-of-Stake (LPoS) consensus mechanism that allows you to use your Tezos voting power to choose a baker who will create blockchain blocks and earn rewards. Part of these rewards is distributed back to you. Your Tezos stay in your wallet, and you can spend them or change a baker anytime.'
          }
        </Text>
        <Divider size={formatSize(16)} />
        <Text style={styles.text}>Please, watch this video for more details.</Text>
        <Divider size={formatSize(16)} />
        <TextLink url={delegationManual}>({delegationManual})</TextLink>
        <Divider size={formatSize(16)} />
        <Text style={styles.text}>In case you have any questions, write them in our communities</Text>
        <Divider size={formatSize(16)} />
        <View style={styles.buttonLinksContainer}>
          <SocialButton iconName={IconNameEnum.Telegram} url={telegramUrl} />
          <SocialButton iconName={IconNameEnum.Discord} url={discordUrl} />
          <SocialButton iconName={IconNameEnum.Twitter} url={twitterUrl} />
          <SocialButton iconName={IconNameEnum.YouTube} url={youTubeUrl} />
          <SocialButton iconName={IconNameEnum.Reddit} url={redditUrl} />
        </View>
      </View>

      <ButtonsContainer>
        <ButtonDelegatePrimary title="Delegate" onPress={onDelegatePress} />
      </ButtonsContainer>
    </ScreenContainer>
  );
};
