import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { TextLink } from '../../components/text-link/text-link';
import { HardcodedNotificationType } from '../../enums/hardcoded-notification-type.enum';
import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { readNotificationsItemAction } from '../../store/notifications/notifications-actions';
import { useNotificationsItemSelector } from '../../store/notifications/notifications-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { formatDate } from '../../utils/format-date.utils';
import { isDefined } from '../../utils/is-defined';
import { useNotificationsItemsStyles } from './notifications-item.styles';

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
    return null;
  }

  return (
    <>
      <ScrollView>
        <View style={styles.imageWrapper}>
          <FastImage style={styles.image} source={{ uri: notification.mobileImageUrl }} />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{notification.title}</Text>
          <Divider size={formatSize(16)} />
          <Text style={styles.description}>{notification.content}</Text>
          <Divider size={formatSize(16)} />
          <View style={styles.detailsContainer}>
            <Text style={styles.createdAt}>{formatDate(notification.createdAt)}</Text>
            <Text style={styles.createdAt}>•</Text>
            {isDefined(notification.sourceUrl) && <TextLink url={notification.sourceUrl}>Read In Original</TextLink>}
          </View>
        </View>
      </ScrollView>
      <View style={styles.submitContainer}>
        <ButtonsContainer>
          <ButtonLargePrimary title="Got it" onPress={goBack} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </>
  );
};
