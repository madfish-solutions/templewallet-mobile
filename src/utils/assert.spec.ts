import { assert, AssertionError } from './assert.utils';

describe('assert', () => {
  it('should throw an error if variable is undefined', () => {
    expect(() => assert(undefined)).toThrowError(new AssertionError('The value undefined is not truthy', undefined));
  });

  it('should throw an error if variable is null', () => {
    expect(() => assert(null)).toThrowError(new AssertionError('The value null is not truthy', null));
  });

  it('should not throw an error if variable is empty string', () => {
    expect(() => assert('')).not.toThrowError();
  });

  it('should not throw an error if variable is an object', () => {
    expect(() => assert({})).not.toThrowError();
  });
});
