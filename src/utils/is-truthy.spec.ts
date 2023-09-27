import { isTruthy } from './is-truthy';

/** See: https://developer.mozilla.org/en-US/docs/Glossary/Falsy */
const ALL_FALSY_VALUES = [false, 0, -0, 0n, -0n, '', NaN, null, undefined];

const SOME_TRUTHY_VALUES = [123, '123', true, {}, Infinity];

describe('isTruthy', () => {
  it("should return `false` for all 'falsy' values", () => {
    expect(ALL_FALSY_VALUES.some(isTruthy)).toEqual(false);
  });

  it("should return `true` for all 'truthy' values", () => {
    expect(SOME_TRUTHY_VALUES.every(isTruthy)).toEqual(true);
  });
});
