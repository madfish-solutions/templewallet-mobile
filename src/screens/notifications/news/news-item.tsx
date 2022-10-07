import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { NewsNotificationInterface, NewsType, StatusType } from '../../../interfaces/news.interface';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { formatDate } from '../../../utils/format-date.utils';
import { useNewsItemStyles } from './news-item.styles';

export const NewsItem: FC<NewsNotificationInterface> = ({ id, createdAt, status, type, title, description }) => {
  const colors = useColors();
  const styles = useNewsItemStyles();
  const { navigate } = useNavigation();

  const isNewsRead = status === StatusType.Read;

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
  }, [type]);

  const handlePress = useCallback(() => {
    navigate(ScreensEnum.NewsScreen, { id });
  }, []);

  return (
    <TouchableOpacity onPress={handlePress} style={isNewsRead ? styles.containerRead : styles.container}>
      <Icon size={formatSize(24)} name={iconName} color={colors.gray2} />
      <Divider size={formatSize(10)} />
      <View style={styles.contentWrapper}>
        <View>
          <Text style={isNewsRead ? styles.titleRead : styles.title}>{title}</Text>
          <Divider size={formatSize(8)} />
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.dateDetailsInfo}>
          <Text style={styles.createdAt}>{formatDate(createdAt)}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>Details</Text>
            <Divider size={formatSize(4)} />
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(16)} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
