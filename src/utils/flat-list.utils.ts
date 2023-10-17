import { FlatListProps } from 'react-native';

export const createGetItemLayout =
  <T>(itemHeight: number, gapHeight?: number): Exclude<FlatListProps<T>['getItemLayout'], undefined> =>
  (_, index) => ({
    length: itemHeight,
    offset: (gapHeight ? itemHeight + gapHeight : itemHeight) * index,
    index
  });
