import { openUrl, tzktUrl } from './linking.util';

describe('tzktUrl', () => {
  it('should return tzkt link with passed non-empty address path', () => {
    expect(tzktUrl('test')).toEqual('https://tzkt.io/test');
  });

  it('should return tzkt link with passed empty address path', () => {
    expect(tzktUrl('')).toEqual('https://tzkt.io/');
  });
});

describe('openUrl', () => {
  it('should open link in web view', () => {
    return openUrl('https://tzkt.io/').then(() => expect(undefined).toHaveBeenCalled());
  });
});
