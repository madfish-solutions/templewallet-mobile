import { useSelector } from 'react-redux';

import { StatusType } from '../../interfaces/news.interface';
import { welcomeNewsNotifications } from './news-data';
import { NewsRootState, NewsState } from './news-state';

const useBaseSelector = () => {
  const loadedNews = useSelector<NewsRootState, NewsState['news']>(({ newsState }) => newsState.news);
  const news = Array.isArray(loadedNews)
    ? loadedNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return news;
};

export const useNewsIdSelector = (key: string) =>
  useBaseSelector().find(x => x.id === key) ?? welcomeNewsNotifications[0];

export const useNewsSelector = () => useBaseSelector();

export const useIsEveryNewsSeenSelector = () => useBaseSelector().every(x => x.status !== StatusType.New);

export const useNewsLoadingSelector = () =>
  useSelector<NewsRootState, NewsState['loading']>(({ newsState }) => newsState.loading);
