import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { TextLink } from '../../../components/text-link/text-link';
import { StatusType } from '../../../interfaces/news.interface';
import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { readNewsAction } from '../../../store/news/news-actions';
import { useNewsIdSelector } from '../../../store/news/news-selectors';
import { formatSize } from '../../../styles/format-size';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { formatDate } from '../../../utils/format-date.utils';
import { isDefined } from '../../../utils/is-defined';
import { useNewsPageStyles } from './news-page.styles';

export const NewsPage: FC = () => {
  const { id } = useRoute<RouteProp<ScreensParamList, ScreensEnum.NewsScreen>>().params;
  const { createdAt, status, title, content, mobileImageUrl, readInOriginalUrl } = useNewsIdSelector(id);
  const styles = useNewsPageStyles();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    if (status !== StatusType.Read) {
      dispatch(readNewsAction([id]));
    }
  }, []);

  usePageAnalytic(ScreensEnum.Notifications, id);

  return (
    <>
      <ScrollView>
        <View
          style={[
            styles.imageWrapper,
            {
              width: windowWidth
            }
          ]}
        >
          {isDefined(mobileImageUrl) && <FastImage style={styles.image} source={{ uri: mobileImageUrl }} />}
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Divider size={formatSize(16)} />
          <Text style={styles.description}>{content}</Text>
          <Divider size={formatSize(16)} />
          <View style={styles.detailsContainer}>
            <Text style={styles.createdAt}>{formatDate(createdAt)}</Text>
            <Text style={styles.createdAt}>•</Text>
            <TextLink url={readInOriginalUrl}>Read In Original</TextLink>
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
