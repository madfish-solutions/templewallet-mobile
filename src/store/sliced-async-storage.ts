import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage';
import { range } from 'lodash-es';

import { isDefined } from 'src/utils/is-defined';

const MAX_SLICE_SIZE_BYTES = 2e6; // 2MB
const CANNOT_BE_ROOT_VALUE_LENGTH_THRESHOLD = 1000;

interface RootSlicedValue {
  _isSliced: true;
  slices: number;
}

const rootValueIsSliced = (rootValue: string) => {
  if (rootValue.length > CANNOT_BE_ROOT_VALUE_LENGTH_THRESHOLD) {
    return false;
  }

  try {
    const parsedValue = JSON.parse(rootValue);

    return parsedValue?._isSliced === true && typeof parsedValue.slices === 'number';
  } catch {
    return false;
  }
};

const getSliceKey = (rootKey: string, sliceIndex: number) => `${rootKey}__SLICE__${sliceIndex}`;

const getSlicesKeys = async (rootKey: string) => {
  const rawRootValue = await AsyncStorage.getItem(rootKey);

  if (isDefined(rawRootValue) && rootValueIsSliced(rawRootValue)) {
    const { slices } = JSON.parse(rawRootValue) as RootSlicedValue;

    return range(0, slices).map(sliceIndex => getSliceKey(rootKey, sliceIndex));
  }

  return [];
};

export const SlicedAsyncStorage: Pick<AsyncStorageStatic, 'getItem' | 'setItem' | 'removeItem'> = {
  getItem: async (key: string) => {
    const rootValue = await AsyncStorage.getItem(key);

    if (isDefined(rootValue) && rootValueIsSliced(rootValue)) {
      const { slices } = JSON.parse(rootValue) as RootSlicedValue;

      const slicesKeys = range(0, slices).map(sliceIndex => getSliceKey(key, sliceIndex));
      const slicesPairs = await AsyncStorage.multiGet(slicesKeys);
      const slicesValues = slicesKeys.map(sliceKey => slicesPairs.find(([key]) => key === sliceKey)?.[1]);

      const result = slicesValues.map(value => value ?? '').join('');

      return result;
    }

    return rootValue;
  },
  setItem: async (key: string, value: string) => {
    try {
      if (value.length > MAX_SLICE_SIZE_BYTES / 2) {
        throw new Error('Using slicing before it is too late');
      }

      const slicesKeys = await getSlicesKeys(key);
      await AsyncStorage.setItem(key, value);
      await AsyncStorage.multiRemove(slicesKeys);
    } catch {
      const slicesCount = Math.ceil((value.length / MAX_SLICE_SIZE_BYTES) * 2);
      const sliceSize = Math.ceil(value.length / slicesCount);
      const slices = range(0, slicesCount).map(sliceIndex =>
        value.slice(sliceIndex * sliceSize, (sliceIndex + 1) * sliceSize)
      );
      const prevSlicesKeys = await getSlicesKeys(key);
      await AsyncStorage.multiSet([
        [key, JSON.stringify({ _isSliced: true, slices: slices.length })],
        ...slices.map((slice, index): [string, string] => [getSliceKey(key, index), slice])
      ]);
      const currentSlicesKeys = slices.map((_, index) => getSliceKey(key, index));
      await AsyncStorage.multiRemove(prevSlicesKeys.filter(key => !currentSlicesKeys.includes(key)));
    }
  },
  removeItem: async (key: string) => {
    const rawRootValue = await AsyncStorage.getItem(key);

    if (isDefined(rawRootValue) && rootValueIsSliced(rawRootValue)) {
      const { slices } = JSON.parse(rawRootValue) as RootSlicedValue;

      const slicesKeys = range(0, slices).map(sliceIndex => getSliceKey(key, sliceIndex));

      await AsyncStorage.multiRemove([key, ...slicesKeys]);
    } else if (isDefined(rawRootValue)) {
      await AsyncStorage.removeItem(key);
    }
  }
};
