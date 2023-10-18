import { FlatListProps } from 'react-native';

export const createGetItemLayout =
  <T>(itemHeight: number, gapHeight = 0): Exclude<FlatListProps<T>['getItemLayout'], undefined> =>
  (_, index) => ({
    length: itemHeight,
    offset: (itemHeight + gapHeight) * index,
    index
  });
