import { createEntity } from '../create-entity';
import { NewsState } from './news-state';

export const mockNewsState: NewsState = {
  news: createEntity([]),
  newsEnabled: true
};
