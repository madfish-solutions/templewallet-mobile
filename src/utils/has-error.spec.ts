import { hasError } from './has-error';

describe('hasError', () => {
  it('should return false if a field is neither touched nor has error', () => {
    expect(hasError({ value: 'mockValue', touched: false, initialTouched: false })).toEqual(false);
  });

  it('should return false if a field is not touched but has error', () => {
    expect(hasError({ value: 'mockValue', touched: false, initialTouched: false, error: 'mockError' })).toEqual(false);
  });

  it('should return true if a field is touched and has error', () => {
    expect(hasError({ value: 'mockValue', touched: true, initialTouched: false, error: 'mockError' })).toEqual(true);
  });

  it('should return false if a field is touched but has no error', () => {
    expect(hasError({ value: 'mockValue', touched: true, initialTouched: false })).toEqual(false);
  });
});
