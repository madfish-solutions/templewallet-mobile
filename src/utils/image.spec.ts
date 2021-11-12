import { formatImgUri, formatNftUri } from './image.utils';

const objktOrigin = 'https://assets.objkt.com/file/assets-001/';

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
  describe('formatNftUri', () => {
    it('should convert asset KT and id to objkt.com URL for that asset', () => {
      expect(formatNftUri('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', '464017', 120)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/1/7/464017/thumb288`
      );
    });
    it('should convert asset KT and id to objkt.com URL for that asset with big size thumb', () => {
      expect(formatNftUri('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', '464017', 320)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/1/7/464017/thumb400`
      );
    });
    it('should convert asset KT and id with id < 10 to objkt.com URL for that asset', () => {
      expect(formatNftUri('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', '9', 120)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/0/9/9/thumb288`
      );
    });
  });
});
