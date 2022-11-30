import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from '../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextLink } from '../../components/text-link/text-link';
import { HardcodedNotificationType } from '../../enums/hardcoded-notification-type.enum';
import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { readNotificationsItemAction } from '../../store/notifications/notifications-actions';
import { useNotificationsItemSelector } from '../../store/notifications/notifications-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { formatDateOutput } from '../../utils/date.utils';
import { isDefined } from '../../utils/is-defined';
import { useNotificationsItemsStyles } from './notifications-item.styles';
import { WelcomeNotificationsItem } from './welcome-notifications-item/welcome-notifications-item';

export const NotificationsItem: FC = () => {
  const styles = useNotificationsItemsStyles();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const params = useRoute<RouteProp<ScreensParamList, ScreensEnum.NotificationsItem>>().params;
  const notification = useNotificationsItemSelector(params.id);

  useEffect(() => void dispatch(readNotificationsItemAction(notification?.id ?? 0)), [notification?.id]);

  usePageAnalytic(ScreensEnum.Notifications, notification?.id.toString());

  if (!isDefined(notification)) {
    return null;
  }

  if (notification.type === HardcodedNotificationType.Welcome) {
    return <WelcomeNotificationsItem />;
  }

  return (
    <>
      <ScreenContainer isFullScreenMode={true}>
        <View style={styles.imageContainer}>
          <SvgUri uri={notification.mobileImageUrl} width="100%" height="100%" />
        </View>
        <Divider size={formatSize(20)} />
        <Text style={styles.title}>{notification.title}</Text>
        <Divider size={formatSize(16)} />
        <Text style={styles.description}>{notification.content}</Text>
        {isDefined(notification.link) && (
          <View style={styles.row}>
            <Text style={styles.description}>{notification.link.beforeLinkText}</Text>
            <TextLink url={notification.link.url} style={styles.link}>
              {notification.link.linkText}
            </TextLink>
            <Text style={styles.description}>{notification.link.afterLinkText}</Text>
          </View>
        )}
        <Divider size={formatSize(16)} />
        <View style={styles.row}>
          <Text style={styles.createdAt}>{formatDateOutput(notification.createdAt)}</Text>
          {isDefined(notification.sourceUrl) && (
            <>
              <Text style={styles.createdAt}> • </Text>
              <TextLink url={notification.sourceUrl}>Read In Original</TextLink>
            </>
          )}
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
