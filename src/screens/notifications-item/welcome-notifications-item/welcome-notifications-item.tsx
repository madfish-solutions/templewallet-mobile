import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { discordInviteUrl, knowledgeBase, telegramCommunityUrl } from '../../../config/socials';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useNotificationsStartFromTimeSelector } from '../../../store/notifications/notifications-selectors';
import { formatSize } from '../../../styles/format-size';
import { formatDateOutput } from '../../../utils/date.utils';
import { useNotificationsItemsStyles } from '../notifications-item.styles';

const youtubeTutorialUrl = 'https://www.youtube.com/watch?v=0wgR-H8I9xg&list=PLVfSwYHwGJ2Gyyf16LEIgvkNoC1YtgjX1';

export const WelcomeNotificationsItem: FC = () => {
  const styles = useNotificationsItemsStyles();
  const { goBack } = useNavigation();

  const startFromTime = useNotificationsStartFromTimeSelector();

  return (
    <>
      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.imageContainer}>
          <SvgUri
            uri="https://generic-objects.fra1.digitaloceanspaces.com/notification-icons/mobile/news.svg"
            width="100%"
            height="100%"
          />
        </View>
        <Divider size={formatSize(20)} />
        <Text style={styles.title}>Welcome to the Temple wallet!</Text>
        <Divider size={formatSize(16)} />
        <Text style={styles.description}>
          Welcome, traveler.{'\n'}
          You are now entering the ancient halls of the Temple. Stay a while and listen.{'\n\n'}
          Temple wallet stands among the first dedicated Tezos wallets and is used by hundreds of thousand Tezonians.
          This is a great start of your Tezos experience if you are new or a great boost of your capabilities if you’re
          a seasoned adventurer.{'\n\n'}
          It boasts all the features you would expect from a modern crypto wallet:{'\n'}- Top up balance with crypto or
          credit card.{'\n'}- Sync your wallet between mobile and desktop devices.{'\n'}- Use our swap router to conduct
          advantageous exchanges.{'\n'}- Store NFTs in the Collectibles tab.{'\n'}- And more!{'\n\n'}
          To quickly learn the ropes, check our{' '}
          <TextLink url={knowledgeBase} style={styles.link}>
            knowledge base
          </TextLink>{' '}
          and{' '}
          <TextLink url={youtubeTutorialUrl} style={styles.link}>
            YouTube video tutorials
          </TextLink>{' '}
          out.{'\n\n'}
          If you have any questions or suggestions, reach us at info@madfish.solutions.{'\n'}
          To talk to us directly, join our online communities in{' '}
          <TextLink url={telegramCommunityUrl} style={styles.link}>
            Telegram
          </TextLink>{' '}
          and{' '}
          <TextLink url={discordInviteUrl} style={styles.link}>
            Discord
          </TextLink>
          . We’re happy to have you!
        </Text>
        <Divider size={formatSize(16)} />
        <View style={styles.row}>
          <Text style={styles.createdAt}>{formatDateOutput(new Date(startFromTime).toString())}</Text>
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonsContainer>
          <ButtonLargePrimary title="Got it" onPress={() => goBack()} />
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
