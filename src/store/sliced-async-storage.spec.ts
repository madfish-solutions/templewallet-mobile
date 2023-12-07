import AsyncStorage from '@react-native-async-storage/async-storage';
import { range } from 'lodash-es';

import { isDefined } from 'src/utils/is-defined';

import { SlicedAsyncStorage, SlicedAsyncStorageError } from './sliced-async-storage';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const nonStringValues = [undefined, null, 0, 1, true, false, {}, [], () => {}, Symbol('test')];
const nonSlicedValue = 'a'.repeat(1e6);

const cyrLetters = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
const charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789${cyrLetters}`;

const bigValueSlices = range(0, 4).map(() =>
  range(0, 1e6)
    .map(() => charset[Math.floor(Math.random() * charset.length)])
    .join('')
);
const bigValue = bigValueSlices.join('');

const cyrLettersOnlyBigValueSlices = range(0, 6).map(() =>
  range(0, 1e6)
    .map(() => cyrLetters[Math.floor(Math.random() * cyrLetters.length)])
    .join('')
);

const testKey = 'test';
const doNotTouchTestKeys = ['doNotTouch', 'doNotTouch2'];

const setBigValue = async (slices: string[], key: string) =>
  AsyncStorage.multiSet([
    [key, `_SLICED_:${slices.length}`],
    ...slices.map((slice, index): [string, string] => [`${key}__SLICE__${index}`, slice])
  ]);

const expectCorrectSlicedValue = async (totalValue: string, key: string) => {
  const allKeys = await AsyncStorage.getAllKeys();
  const allRelatedKeys = allKeys.filter(storedKey => storedKey.startsWith(key));
  const expectedSlicesKeys = range(0, allRelatedKeys.length - 1).map(sliceIndex => `${key}__SLICE__${sliceIndex}`);
  const expectedSortedKeys = [...expectedSlicesKeys, key].sort();
  expect(allRelatedKeys.sort()).toEqual(expectedSortedKeys);

  expect(await AsyncStorage.getItem(key)).toEqual(`_SLICED_:${allRelatedKeys.length - 1}`);
  const slicesPairs = await AsyncStorage.multiGet(expectedSlicesKeys);
  const slicesValues = expectedSlicesKeys.map(sliceKey => slicesPairs.find(([key]) => key === sliceKey)?.[1]);
  expect(slicesValues.every(isDefined)).toEqual(true);
  expect(slicesValues.every(value => value!.length <= 1e6)).toEqual(true);
  expect(slicesValues.join('')).toEqual(totalValue);
};

describe('SlicedAsyncStorage', () => {
  beforeEach(async () => AsyncStorage.clear());

  describe('getItem', () => {
    it('should return null for non-existing key', async () => {
      expect(await SlicedAsyncStorage.getItem('test')).toEqual(null);
    });

    it('should fetch a value if it is stored in one key', async () => {
      await AsyncStorage.setItem(testKey, nonSlicedValue);

      expect(await SlicedAsyncStorage.getItem(testKey)).toEqual(nonSlicedValue);
    });

    it('should fetch value if it is stored in slices', async () => {
      await setBigValue(bigValueSlices, testKey);

      expect(await SlicedAsyncStorage.getItem(testKey)).toEqual(bigValue);
    });

    it('should throw SlicedAsyncStorageError in case the passed key is not a string', async () => {
      for (const value of nonStringValues) {
        // eslint-disable-next-line no-type-assertion/no-type-assertion,@typescript-eslint/no-explicit-any
        await expect(() => SlicedAsyncStorage.getItem(value as any)).rejects.toThrowError(SlicedAsyncStorageError);
      }
    });
  });

  describe('setItem', () => {
    describe('setting item for the first time', () => {
      it('should set the value of JS length 1e6 or less as before', async () => {
        await SlicedAsyncStorage.setItem(testKey, nonSlicedValue);

        expect(await AsyncStorage.getItem(testKey)).toEqual(nonSlicedValue);
        expect(await AsyncStorage.getAllKeys()).toEqual([testKey]);
      });

      it('should set the first value of JS length greater than 1e6 by slices', async () => {
        await SlicedAsyncStorage.setItem(testKey, bigValue);

        await expectCorrectSlicedValue(bigValue, testKey);
      });
    });

    describe('overriding the value of JS length not greater than 1e6', () => {
      it('should set the new value of JS length not greater than 1e6 as before', async () => {
        const value = 'a'.repeat(1e6);
        await AsyncStorage.setItem(testKey, value);

        const newValue = 'b'.repeat(1e6);
        await SlicedAsyncStorage.setItem(testKey, newValue);

        expect(await AsyncStorage.getItem(testKey)).toEqual(newValue);
        expect(await AsyncStorage.getAllKeys()).toEqual([testKey]);
      });

      it('should set the new value of JS length greater than 1e6 by slices', async () => {
        await AsyncStorage.setItem(testKey, nonSlicedValue);

        await SlicedAsyncStorage.setItem(testKey, bigValue);

        await expectCorrectSlicedValue(bigValue, testKey);
      });
    });

    describe('overriding the value of JS length greater than 1e6', () => {
      it('should set the new value of JS length not greater than 1e6 and remove slices', async () => {
        await setBigValue(bigValueSlices, testKey);

        await SlicedAsyncStorage.setItem(testKey, nonSlicedValue);

        expect(await AsyncStorage.getItem(testKey)).toEqual(nonSlicedValue);
        expect(await AsyncStorage.getAllKeys()).toEqual([testKey]);
      });

      it('should set the new value of JS length greater than 1e6 and remove redundant slices', async () => {
        await setBigValue(cyrLettersOnlyBigValueSlices, testKey);

        await SlicedAsyncStorage.setItem(testKey, bigValue);

        await expectCorrectSlicedValue(bigValue, testKey);
      });
    });

    it('should throw SlicedAsyncStorageError in case the passed key is not a string', async () => {
      for (const value of nonStringValues) {
        // eslint-disable-next-line no-type-assertion/no-type-assertion,@typescript-eslint/no-explicit-any
        await expect(() => SlicedAsyncStorage.setItem(value as any, nonSlicedValue)).rejects.toThrowError(
          SlicedAsyncStorageError
        );
      }
    });

    it('should throw SlicedAsyncStorageError in case the passed value is not a string', async () => {
      for (const value of nonStringValues) {
        // eslint-disable-next-line no-type-assertion/no-type-assertion,@typescript-eslint/no-explicit-any
        await expect(() => SlicedAsyncStorage.setItem(testKey, value as any)).rejects.toThrowError(
          SlicedAsyncStorageError
        );
      }
    });
  });

  describe('removeItem', () => {
    it('should remove the value of JS length not greater than 1e6 as before', async () => {
      await AsyncStorage.setItem(doNotTouchTestKeys[0], nonSlicedValue);
      await setBigValue(bigValueSlices, doNotTouchTestKeys[1]);
      await AsyncStorage.setItem(testKey, nonSlicedValue);

      await SlicedAsyncStorage.removeItem(testKey);

      expect(await AsyncStorage.getItem(testKey)).toEqual(null);
      expect(await AsyncStorage.getItem(doNotTouchTestKeys[0])).toEqual(nonSlicedValue);
      await expectCorrectSlicedValue(bigValue, doNotTouchTestKeys[1]);
    });

    it('should remove the value of JS length greater than 1e6 without leaving garbage', async () => {
      await AsyncStorage.setItem(doNotTouchTestKeys[0], nonSlicedValue);
      await setBigValue(bigValueSlices, doNotTouchTestKeys[1]);
      await setBigValue(cyrLettersOnlyBigValueSlices, testKey);

      await SlicedAsyncStorage.removeItem(testKey);

      expect(await AsyncStorage.getItem(doNotTouchTestKeys[0])).toEqual(nonSlicedValue);
      await expectCorrectSlicedValue(bigValue, doNotTouchTestKeys[1]);
      const leftKeys = await AsyncStorage.getAllKeys();
      expect(leftKeys.every(key => doNotTouchTestKeys.includes(key) || key.startsWith(doNotTouchTestKeys[1]))).toEqual(
        true
      );
    });

    it('should throw SlicedAsyncStorageError in case the passed key is not a string', async () => {
      for (const value of nonStringValues) {
        // eslint-disable-next-line no-type-assertion/no-type-assertion,@typescript-eslint/no-explicit-any
        await expect(() => SlicedAsyncStorage.removeItem(value as any)).rejects.toThrowError(SlicedAsyncStorageError);
      }
    });
  });
});
