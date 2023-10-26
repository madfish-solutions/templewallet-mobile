import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonDelegatePrimary } from '../../../components/button/button-large/button-delegate-primary/button-delegate-primary';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { discordUrl, redditUrl, telegramUrl, twitterUrl, youTubeUrl } from '../../../config/socials';
import { formatSize } from '../../../styles/format-size';
import { SocialButton } from '../../settings/settings-header/social-button/social-button';

import { AboutDelegationScreenSelectors } from './about-delegation-screen.selectors';
import { useAboutDelegationScreenStyles } from './about-delegation-screen.styles';

interface Props {
  onDelegatePress: EmptyFn;
}

export const AboutDelegationScreen: FC<Props> = ({ onDelegatePress }) => {
  const styles = useAboutDelegationScreenStyles();

  return (
    <>
      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.content}>
          <Divider size={formatSize(24)} />
          <Text style={styles.title}>
            <Text style={styles.titleBlue}>Earn 5.6% interest</Text> on your Tezos annualy from Baking rewards
          </Text>
          <Divider size={formatSize(24)} />
          <View style={styles.descriptionContainer}>
            <View style={styles.row}>
              <Icon name={IconNameEnum.Delegate1} size={formatSize(42)} />
              <Text style={styles.description}>Your first reward in Tezos will be paid approximately in 36 days.</Text>
            </View>
            <Divider size={formatSize(32)} />
            <View style={styles.row}>
              <Icon name={IconNameEnum.Delegate2} size={formatSize(42)} />
              <Text style={styles.description}>Then, you receive a reward every 3 days.</Text>
            </View>
            <Divider size={formatSize(32)} />
            <View style={styles.row}>
              <Icon name={IconNameEnum.Delegate3} size={formatSize(42)} />
              <Text style={styles.description}>Earn rate varies over time. Check the current rate in your Wallet.</Text>
            </View>
            <Divider size={formatSize(32)} />
            <View style={styles.row}>
              <Icon name={IconNameEnum.Delegate4} size={formatSize(42)} />
              <Text style={styles.description}>Your Tezos tokens are never locked. Send anytime!</Text>
            </View>
          </View>
          <Divider size={formatSize(24)} />
          <Text style={styles.text}>In case you have any questions, write them in our communities</Text>
          <Divider size={formatSize(20)} />
          <View style={styles.buttonLinksContainer}>
            <SocialButton
              iconName={IconNameEnum.Telegram}
              url={telegramUrl}
              testID={AboutDelegationScreenSelectors.telegramButton}
            />
            <SocialButton
              iconName={IconNameEnum.Discord}
              url={discordUrl}
              testID={AboutDelegationScreenSelectors.discordButton}
            />
            <SocialButton
              iconName={IconNameEnum.Twitter}
              url={twitterUrl}
              testID={AboutDelegationScreenSelectors.twitterButton}
            />
            <SocialButton
              iconName={IconNameEnum.YouTube}
              url={youTubeUrl}
              testID={AboutDelegationScreenSelectors.youTubeButton}
            />
            <SocialButton
              iconName={IconNameEnum.Reddit}
              url={redditUrl}
              testID={AboutDelegationScreenSelectors.redditButton}
            />
          </View>
          <Divider size={formatSize(24)} />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonDelegatePrimary
          title="Delegate"
          onPress={onDelegatePress}
          testID={AboutDelegationScreenSelectors.delegateButton}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
