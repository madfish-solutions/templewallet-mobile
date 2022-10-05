import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { NewsNotificationInterface, StatusType } from '../../../interfaces/news.interface';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { readNewsAction } from '../../../store/news/news-actions';
import { useNewsIdSelector } from '../../../store/news/news-selectors';
import { formatSize } from '../../../styles/format-size';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../utils/is-defined';
import { useNewsItemStyles } from './news-item.styles';

export const NewsPage: FC<NewsNotificationInterface> = ({ id }) => {
  const {
    // createdAt,
    status,
    // type,
    // platform,
    // language,
    // title,
    // description,
    // content,
    mobileImageUrl
    // readInOriginalUrl
  } = useNewsIdSelector(id);
  const styles = useNewsItemStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== StatusType.Read) {
      dispatch(readNewsAction([id]));
    }
  }, []);

  //   const styles = useCollectibleIconStyles();
  //   const actualLoadingStrategy =
  //     iconSize === CollectibleIconSize.SMALL ? collectibleThumbnailLoadStrategy : collectibleBigLoadStrategy;
  const [, setIsLoadingFailed] = useState(false);

  const handleLoadingFailed = () => {
    setIsLoadingFailed(true);
  };

  usePageAnalytic(ScreensEnum.Notifications, id);

  return (
    <View>
      <View
        style={{
          width: formatSize(100),
          height: formatSize(100),
          padding: formatSize(4)
        }}
      >
        {isDefined(mobileImageUrl) && (
          <FastImage style={styles.image} source={{ uri: mobileImageUrl }} onError={handleLoadingFailed} />
        )}
      </View>
    </View>
  );
};
