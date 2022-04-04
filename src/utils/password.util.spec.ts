import { getTimeLeft } from './password.util';

describe('getTimeLeft', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2022-04-04').getTime()));
  it('should return zero, when end time is zero', () => {
    expect(getTimeLeft(1649030400000, 0)).toBe('00:00');
  });
  it('should return some time when end time is bigger than end start', () => {
    expect(getTimeLeft(1649030400000, 110000)).toBe('01:50');
  });
});
