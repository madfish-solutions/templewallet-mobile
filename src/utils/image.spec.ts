import { formatImgUri } from './image.utils';

describe('formatImgUri', () => {
  it('should leave http:// uri intact', () => {
    const mockHttpUri = 'http://mocklink.com';

    expect(formatImgUri(mockHttpUri)).toEqual(mockHttpUri);
  });

  it('should leave https:// uri intact', () => {
    const mockHttpsUri = 'https://mocklink.com';

    expect(formatImgUri(mockHttpsUri)).toEqual(mockHttpsUri);
  });

  it('should convert ipfs:// uri to URL to ipfs.io for that file', () => {
    expect(formatImgUri('ipfs://mockFileHash')).toEqual('https://ipfs.io/ipfs/mockFileHash/');
  });
});
