import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { readNotificationsItemAction } from 'src/store/notifications/notifications-actions';
import { useNotificationsItemSelector } from 'src/store/notifications/notifications-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatDateOutput } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { NotificationImageFallbacks } from './notification-image-fallbacks';
import { NotificationItemSelectors } from './notification-item.selectors';
import { NotificationsItemContent } from './notifications-item-content/notifications-item-content';
import { IMAGE_HEIGHT, useNotificationsItemStyles } from './notifications-item.styles';

export const NotificationsItem: FC = () => {
  const styles = useNotificationsItemStyles();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const { id } = useScreenParams<ScreensEnum.NotificationsItem>();
  const notification = useNotificationsItemSelector(id);

  const [imageUri, setImageUri] = useState(notification?.mobileImageUrl ?? '');

  useEffect(() => void dispatch(readNotificationsItemAction(notification?.id ?? 0)), [notification?.id]);

  usePageAnalytic(ScreensEnum.NotificationsItem, '', {
    id: notification?.id,
    type: notification?.type
  });

  if (!isDefined(notification)) {
    return null;
  }

  return (
    <>
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <View style={styles.imageContainer}>
            <SvgCssUri
              uri={imageUri}
              height={IMAGE_HEIGHT}
              onError={() => setImageUri(NotificationImageFallbacks[notification.type])}
            />
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
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonsContainer>
          <ButtonLargePrimary title="Got it" onPress={() => goBack()} testID={NotificationItemSelectors.gotItButton} />
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
