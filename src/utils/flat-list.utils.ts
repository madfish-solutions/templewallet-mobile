import { FlatListProps } from 'react-native';

export const createGetItemLayout =
  <T>(itemHeight: number): Exclude<FlatListProps<T>['getItemLayout'], undefined> =>
  (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index
  });
