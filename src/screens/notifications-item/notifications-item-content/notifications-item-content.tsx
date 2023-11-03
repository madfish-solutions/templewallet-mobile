import React, { FC } from 'react';
import { Text } from 'react-native';

import { TextLink } from '../../../components/text-link/text-link';
import { NotificationInterface } from '../../../interfaces/notification.interface';

import { useNotificationsItemContentStyles } from './notifications-item-content.styles';

type Props = Pick<NotificationInterface, 'content'>;

export const NotificationsItemContent: FC<Props> = ({ content }) => {
  const styles = useNotificationsItemContentStyles();

  return (
    <Text style={styles.description}>
      {content.map((contentItem, index) => {
        if (typeof contentItem === 'string') {
          return contentItem;
        }

        return (
          <TextLink key={contentItem.url + index} url={contentItem.url} style={styles.link}>
            {contentItem.text}
          </TextLink>
        );
      })}
    </Text>
  );
};
