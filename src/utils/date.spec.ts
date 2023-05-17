import { advanceTo } from 'jest-date-mock';

import { formatTimespan, isTheSameDay, isToday, isYesterday, toSecondsTimestamp } from './date.utils';

describe('formatTimespan', () => {
  it('should apply default formatting if no options overrides are provided', () => {
    expect(formatTimespan(90 * 24 * 3600 * 1000)).toEqual('3 months');
  });

  it('should apply options overrides', () => {
    expect(formatTimespan(90 * 24 * 3600 * 1000, { addSuffix: true, unit: 'day' })).toEqual('in 90 days');
  });
});

describe('toSecondsTimestamp', () => {
  it('should convert timestamp in milliseconds to seconds', () => {
    expect(toSecondsTimestamp(1684150759884)).toEqual(1684150759);
  });

  it('should convert ISO date string to seconds', () => {
    expect(toSecondsTimestamp('2021-07-08T12:32:39.884Z')).toEqual(1625747559);
  });

  it('should convert Date object to seconds', () => {
    expect(toSecondsTimestamp(new Date('2021-07-08T12:32:39.884Z'))).toEqual(1625747559);
  });
});

describe('isTheSameDay', () => {
  it('should return true if both dates have the same day', () => {
    const first = new Date(2021, 7, 8, 0, 0, 0);
    const second = new Date(2021, 7, 8, 23, 59, 59);

    expect(isTheSameDay(first, second)).toEqual(true);
  });

  it('should return false if dates have different days although the difference is less than 24h', () => {
    const first = new Date(2021, 7, 8, 0, 0, 1);
    const second = new Date(2021, 7, 7, 23, 59, 59);

    expect(isTheSameDay(first, second)).toEqual(false);
  });

  it('should return false if dates differ only by month', () => {
    const first = new Date(2021, 7, 8, 0, 0, 0);
    const second = new Date(2021, 8, 8, 0, 0, 0);

    expect(isTheSameDay(first, second)).toEqual(false);
  });

  it('should return false if dates differ only by year', () => {
    const first = new Date(2021, 7, 8, 0, 0, 0);
    const second = new Date(2022, 7, 8, 0, 0, 0);

    expect(isTheSameDay(first, second)).toEqual(false);
  });
});

describe('isToday', () => {
  beforeAll(() => advanceTo(new Date(2021, 7, 8, 12, 0, 0)));

  it('should return true if a date is today', () => {
    expect(isToday(new Date(2021, 7, 8, 0, 0, 1))).toEqual(true);
  });

  it('should return false if a date is tomorrow although the difference is less than 24h', () => {
    expect(isToday(new Date(2021, 7, 9, 0, 0, 1))).toEqual(false);
  });

  it('should return false if a date is month after', () => {
    expect(isToday(new Date(2021, 8, 8, 12, 0, 0))).toEqual(false);
  });

  it('should return false if a date is year after', () => {
    expect(isToday(new Date(2022, 7, 8, 12, 0, 0))).toEqual(false);
  });
});

describe('isYesterday', () => {
  beforeAll(() => advanceTo(new Date(2021, 7, 8, 12, 0, 0)));

  it('should return true if a date is yesterday', () => {
    expect(isYesterday(new Date(2021, 7, 7, 23, 59, 59))).toEqual(true);
  });

  it('should return false if a date is one month and one day before', () => {
    expect(isYesterday(new Date(2021, 6, 7, 23, 59, 59))).toEqual(false);
  });

  it('should return false if a date is one year and one day before', () => {
    expect(isYesterday(new Date(2020, 7, 7, 23, 59, 59))).toEqual(false);
  });
});
