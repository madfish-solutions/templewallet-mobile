import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

import { isDefined } from 'src/utils/is-defined';

/** Ensures that the slice is not greater than 2MB because JS uses UTF-16 encoding */
const MAX_SLICE_LENGTH = 1e6;
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

const buildSliceKey = (rootKey: string, sliceIndex: number) => `${rootKey}__SLICE__${sliceIndex}`;

const buildSlicesKeys = (rootKey: string, slicesCount: number) =>
  new Array(slicesCount).fill(null).map((_, sliceIndex) => buildSliceKey(rootKey, sliceIndex));

const getSlicesKeys = async (rootKey: string) => {
  const rawRootValue = await AsyncStorage.getItem(rootKey);

  const slicesCount = getValueSlicesCount(rawRootValue);

  return buildSlicesKeys(rootKey, slicesCount);
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
  getItem: async (rootKey: string) => {
    assertKeyIsString(rootKey);

    const rootValue = await AsyncStorage.getItem(rootKey);
    const slicesCount = getValueSlicesCount(rootValue);

    if (slicesCount) {
      const slicesKeys = buildSlicesKeys(rootKey, slicesCount);
      const slicesPairs = await AsyncStorage.multiGet(slicesKeys);

      // (!) Don't use `Array.join('')` here - it is slower
      const result = slicesPairs.reduce((acc, curr) => acc + curr ?? '', '');

      return result;
    }

    return rootValue;
  },
  setItem: async (rootKey: string, value: string) => {
    assertKeyIsString(rootKey);
    assertValueIsString(value, rootKey);

    const prevSlicesKeys = await getSlicesKeys(rootKey);

    if (value.length <= MAX_SLICE_LENGTH) {
      await AsyncStorage.setItem(rootKey, value);
      await AsyncStorage.multiRemove(prevSlicesKeys);
    } else {
      const slicesCount = Math.ceil(value.length / MAX_SLICE_LENGTH);

      const slices: StringRecord = {
        [rootKey]: `${SLICED_ROOT_VALUE_PREFIX}${slicesCount}`
      };
      for (let sliceIndex = 0; sliceIndex < slicesCount; sliceIndex++) {
        const key = buildSliceKey(rootKey, sliceIndex);
        const val = value.slice(sliceIndex * MAX_SLICE_LENGTH, (sliceIndex + 1) * MAX_SLICE_LENGTH);
        slices[key] = val;
      }

      await AsyncStorage.multiSet(Object.entries(slices));
      await AsyncStorage.multiRemove(prevSlicesKeys.filter(key => !slices[key]));
    }
  },
  removeItem: async (rootKey: string) => {
    assertKeyIsString(rootKey);
    const rawRootValue = await AsyncStorage.getItem(rootKey);
    const slicesCount = getValueSlicesCount(rawRootValue);

    if (slicesCount) {
      const slicesKeys = buildSlicesKeys(rootKey, slicesCount);

      await AsyncStorage.multiRemove([rootKey, ...slicesKeys]);
    } else if (isDefined(rawRootValue)) {
      await AsyncStorage.removeItem(rootKey);
    }
  }
};
