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

const EMPTY_SLICES_KEYS: string[] = [];

const buildSlicesKeys = (rootKey: string, slicesCount: number) =>
  slicesCount
    ? new Array(slicesCount).fill(null).map((_, sliceIndex) => buildSliceKey(rootKey, sliceIndex))
    : EMPTY_SLICES_KEYS;

const readSlicesKeys = async (rootKey: string) => {
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
      return slicesPairs.reduce((acc, curr) => acc + curr ?? '', '');
    }

    return rootValue;
  },

  setItem: async (rootKey: string, value: string) => {
    assertKeyIsString(rootKey);
    assertValueIsString(value, rootKey);

    const prevSlicesKeys = await readSlicesKeys(rootKey);

    if (value.length <= MAX_SLICE_LENGTH) {
      await Promise.all([
        AsyncStorage.setItem(rootKey, value),
        // Removing possible leftovers
        AsyncStorage.multiRemove(prevSlicesKeys)
      ]);
    } else {
      const slicesCount = Math.ceil(value.length / MAX_SLICE_LENGTH);

      const slices: StringRecord = {
        [rootKey]: `${SLICED_ROOT_VALUE_PREFIX}${slicesCount}`
      };
      for (let i = 0; i < slicesCount; i++) {
        const key = buildSliceKey(rootKey, i);
        slices[key] = value.slice(i * MAX_SLICE_LENGTH, (i + 1) * MAX_SLICE_LENGTH);
      }

      await Promise.all([
        AsyncStorage.multiSet(Object.entries(slices)),
        // Removing possible leftovers
        AsyncStorage.multiRemove(prevSlicesKeys.filter(key => !slices[key]))
      ]);
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
