import { assert, AssertionError } from './assert.utils';

describe('assert', () => {
  it('should throw an error if variable is undefined', () => {
    expect(() => assert(undefined)).toThrow(new AssertionError('The value undefined is not truthy', undefined));
  });

  it('should throw an error if variable is null', () => {
    expect(() => assert(null)).toThrow(new AssertionError('The value null is not truthy', null));
  });

  it('should not throw an error if variable is empty string', () => {
    expect(() => assert('')).not.toThrow();
  });

  it('should not throw an error if variable is an object', () => {
    expect(() => assert({})).not.toThrow();
  });

  it('should throw an error with a custom message', () => {
    expect(() => assert(undefined, 'Custom message')).toThrow(new AssertionError('Custom message', undefined));
  });

  it('should throw an error with a custom error', () => {
    expect(() => assert(undefined, new Error('Custom error'))).toThrow(new Error('Custom error'));
  });
});
