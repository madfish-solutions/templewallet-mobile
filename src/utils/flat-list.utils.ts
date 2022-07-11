import { FlatListProps } from 'react-native';

export const createGetItemLayout =
  <T>(itemHeight: number): FlatListProps<T>['getItemLayout'] =>
  (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index
  });
