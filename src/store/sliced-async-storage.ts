import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage';
import { range } from 'lodash-es';

import { isDefined } from 'src/utils/is-defined';

const MAX_SLICE_LENGTH = 1e6; // Ensures that the slice is not greater than 2MB because JS uses UTF-16 encoding
const SLICED_ROOT_VALUE_PREFIX = '_SLICED_:';
const SLICED_ROOT_VALUE_REGEX = new RegExp(`^${SLICED_ROOT_VALUE_PREFIX}(\\d+)$`);

export class SlicedAsyncStorageError extends Error {
  constructor(message: string, public key?: unknown) {
    super(message);
  }
}

const getValueSlicesCount = (rootValue: string | nullish) => {
  const rootValueRegexMatch = rootValue?.match(SLICED_ROOT_VALUE_REGEX);

  return rootValueRegexMatch ? Number(rootValueRegexMatch[1]) : 0;
};

const getSliceKey = (rootKey: string, sliceIndex: number) => `${rootKey}__SLICE__${sliceIndex}`;

const getSlicesKeys = async (rootKey: string) => {
  const rawRootValue = await AsyncStorage.getItem(rootKey);

  const slicesCount = getValueSlicesCount(rawRootValue);

  return range(0, slicesCount).map(sliceIndex => getSliceKey(rootKey, sliceIndex));
};

const assertKeyIsString = (keyName: unknown): keyName is string => {
  if (typeof keyName !== 'string') {
    throw new SlicedAsyncStorageError(
      `[SlicedAsyncStorage] Using ${typeof keyName} type for key is not supported. Use string instead.\nKey passed: ${JSON.stringify(
        keyName
      )}\n`,
      keyName
    );
  }

  return true;
};

const assertValueIsString = (value: unknown, key: string): value is string => {
  if (typeof value !== 'string') {
    throw new SlicedAsyncStorageError(
      `[SlicedAsyncStorage] The value for key "${key}" is not a string. Stringify it.\nPassed value: ${JSON.stringify(
        value
      )}\nPassed key: ${key}\n`
    );
  }

  return true;
};

export const SlicedAsyncStorage: Pick<AsyncStorageStatic, 'getItem' | 'setItem' | 'removeItem'> = {
  getItem: async (key: string) => {
    assertKeyIsString(key);

    const rootValue = await AsyncStorage.getItem(key);
    const slicesCount = getValueSlicesCount(rootValue);

    if (slicesCount) {
      const slicesKeys = range(0, slicesCount).map(sliceIndex => getSliceKey(key, sliceIndex));
      const slicesPairs = await AsyncStorage.multiGet(slicesKeys);
      const slicesValues = slicesKeys.map(sliceKey => slicesPairs.find(([key]) => key === sliceKey)?.[1]);

      const result = slicesValues.map(value => value ?? '').join('');

      return result;
    }

    return rootValue;
  },
  setItem: async (key: string, value: string) => {
    assertKeyIsString(key);
    assertValueIsString(value, key);

    if (value.length <= MAX_SLICE_LENGTH) {
      const oldSlicesKeys = await getSlicesKeys(key);
      await AsyncStorage.setItem(key, value);
      await AsyncStorage.multiRemove(oldSlicesKeys);
    } else {
      const slicesCount = Math.ceil(value.length / MAX_SLICE_LENGTH);
      const sliceSize = Math.ceil(value.length / slicesCount);
      const slices = range(0, slicesCount).map(sliceIndex =>
        value.slice(sliceIndex * sliceSize, (sliceIndex + 1) * sliceSize)
      );
      const prevSlicesKeys = await getSlicesKeys(key);
      await AsyncStorage.multiSet([
        [key, `${SLICED_ROOT_VALUE_PREFIX}${slicesCount}`],
        ...slices.map((slice, index): [string, string] => [getSliceKey(key, index), slice])
      ]);
      const currentSlicesKeys = slices.map((_, index) => getSliceKey(key, index));
      await AsyncStorage.multiRemove(prevSlicesKeys.filter(key => !currentSlicesKeys.includes(key)));
    }
  },
  removeItem: async (key: string) => {
    assertKeyIsString(key);
    const rawRootValue = await AsyncStorage.getItem(key);
    const slicesCount = getValueSlicesCount(rawRootValue);

    if (slicesCount) {
      const slicesKeys = range(0, slicesCount).map(sliceIndex => getSliceKey(key, sliceIndex));

      await AsyncStorage.multiRemove([key, ...slicesKeys]);
    } else if (isDefined(rawRootValue)) {
      await AsyncStorage.removeItem(key);
    }
  }
};
