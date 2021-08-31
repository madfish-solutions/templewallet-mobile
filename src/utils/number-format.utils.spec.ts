import { formatOrdinalNumber } from './number-format.utils';

describe('formatOrdinalNumber', () => {
  it('format 10 with suffix', () => {
    expect(formatOrdinalNumber(10)).toEqual('10th');
  });

  it('format 1 with suffix', () => {
    expect(formatOrdinalNumber(1)).toEqual('1st');
  });

  it('format 2 with suffix', () => {
    expect(formatOrdinalNumber(2)).toEqual('2nd');
  });

  it('format 3 with suffix', () => {
    expect(formatOrdinalNumber(3)).toEqual('3rd');
  });

  it('return empty string if NaN passed', () => {
    expect(formatOrdinalNumber(NaN)).toEqual('');
  });

  it('format 0 with suffix', () => {
    expect(formatOrdinalNumber(0)).toEqual('0th');
  });

  it('format 12 with suffix', () => {
    expect(formatOrdinalNumber(12)).toEqual('12th');
  });

  it('format 10000 with suffix', () => {
    expect(formatOrdinalNumber(10000)).toEqual('10000th');
  });

  it('format 10000000 with suffix', () => {
    expect(formatOrdinalNumber(10000000)).toEqual('10000000th');
  });
});
