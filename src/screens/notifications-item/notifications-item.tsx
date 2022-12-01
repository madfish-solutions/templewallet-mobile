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
import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { readNotificationsItemAction } from '../../store/notifications/notifications-actions';
import { useNotificationsItemSelector } from '../../store/notifications/notifications-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { formatDateOutput } from '../../utils/date.utils';
import { isDefined } from '../../utils/is-defined';
import { NotificationsItemContent } from './notifications-item-content/notifications-item-content';
import { useNotificationsItemStyles } from './notifications-item.styles';

export const NotificationsItem: FC = () => {
  const styles = useNotificationsItemStyles();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const params = useRoute<RouteProp<ScreensParamList, ScreensEnum.NotificationsItem>>().params;
  const notification = useNotificationsItemSelector(params.id);

  useEffect(() => void dispatch(readNotificationsItemAction(notification?.id ?? 0)), [notification?.id]);

  usePageAnalytic(ScreensEnum.Notifications, notification?.id.toString());

  if (!isDefined(notification)) {
    return null;
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
        <NotificationsItemContent content={notification.content} />
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
