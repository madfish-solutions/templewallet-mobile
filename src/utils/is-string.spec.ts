import { isDefined } from './is-defined';
import { isString } from './is-string';

describe('isString', () => {
  it('should return false if variable is non empty array', () => {
    expect(isString([1])).toEqual(false);
  });

  it('should return false if variable is empty string', () => {
    expect(isString('')).toEqual(false);
  });

  it('should return false if variable is undefined', () => {
    expect(isString(undefined)).toEqual(false);
  });

  it('should return false if variable is null', () => {
    expect(isString(null)).toEqual(false);
  });

  it('should return false if variable is object', () => {
    expect(isString({})).toEqual(false);
  });

  it('should return true if variable is non-empty string', () => {
    expect(isString('test')).toEqual(true);
  });
});
