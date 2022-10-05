import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { NewsNotificationInterface, NewsType, StatusType } from '../../../interfaces/news.interface';
// import { useNewsItemStyles } from './news-item.styles';

export const NewsItem: FC<NewsNotificationInterface> = ({
  // id,
  // createdAt,
  status,
  type
  // platform,
  // language,
  // title,
  // description,
  // content,
  // extensionImageUrl,
  // mobileImageUrl,
  // readInOriginalUrl
}) => {
  // const styles = useNewsItemStyles();

  const iconName: IconNameEnum = useMemo(() => {
    if (type === NewsType.Alert) {
      return IconNameEnum.AppCheckAlert;
    }
    if (status === StatusType.New) {
      if (type === NewsType.ApplicationUpdate) {
        return IconNameEnum.UpdateUnread;
      }

      return IconNameEnum.NewsUnread;
    }
    if (type === NewsType.ApplicationUpdate) {
      return IconNameEnum.UpdateRead;
    }

    return IconNameEnum.NewsRead;
  }, []);

  return (
    <View>
      <Icon name={iconName} />
    </View>
  );
};
