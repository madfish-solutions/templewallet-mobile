import { conditionalStyle } from './conditional-style';

describe('conditionalStyle', () => {
  const trueStyle = { backgroundColor: 'green' };
  const falseStyle = { backgroundColor: 'red' };

  it('should return trueStyle if condition is true', () => {
    expect(conditionalStyle(true, trueStyle, falseStyle)).toEqual(trueStyle);
  });

  it('should return falseStyle if condition is false', () => {
    expect(conditionalStyle(false, trueStyle, falseStyle)).toEqual(falseStyle);
  });

  it('should return trueStyle if condition is true and falseStyle not passed', () => {
    expect(conditionalStyle(true, trueStyle)).toEqual(trueStyle);
  });

  it('should return empty object if condition is false and falseStyle not passed', () => {
    expect(conditionalStyle(false, trueStyle)).toEqual(undefined);
  });
});
