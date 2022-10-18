import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { NewsInterface, NewsType, StatusType } from '../../../interfaces/news.interface';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { formatDate } from '../../../utils/format-date.utils';
import { AlertIcon } from '../icons/alert.icon';
import { NewsIcon } from '../icons/news.icon';
import { UpdateIcon } from '../icons/update.icon';
import { useNewsItemStyles } from './news-item.styles';

export const NewsItem: FC<NewsInterface> = ({ id, createdAt, status, type, title, description }) => {
  const styles = useNewsItemStyles();
  const colors = useColors();
  const { navigate } = useNavigation();

  const isNew = status === StatusType.New;

  const handlePress = () => {
    navigate(ScreensEnum.NewsScreen, { id });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={status === StatusType.Read ? styles.containerRead : styles.container}
    >
      {type === NewsType.Alert ? (
        <AlertIcon color={colors.gray2} isNotification={isNew} />
      ) : type === NewsType.ApplicationUpdate ? (
        <UpdateIcon color={colors.gray2} isNotification={isNew} />
      ) : (
        <NewsIcon color={colors.gray2} isNotification={isNew} />
      )}
      <Divider size={formatSize(10)} />
      <View style={styles.contentWrapper}>
        <View>
          <Text style={status === StatusType.Read ? styles.titleRead : styles.title}>{title}</Text>
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
