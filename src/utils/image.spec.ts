import { formatImgUri, isImgUriSvg } from './image.utils';

describe('image utils', () => {
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
  describe('is image svg', () => {
    it('should return true for img address with .svg', () => {
      expect(isImgUriSvg('https://facebook.com/favicon.svg')).toEqual(true);
    });
    it('should return false for img address with .png', () => {
      expect(isImgUriSvg('https://facebook.com/favicon.png')).toEqual(false);
    });
  });
});
