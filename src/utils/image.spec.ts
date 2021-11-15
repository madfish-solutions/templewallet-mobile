import { TokenInterface } from '../token/interfaces/token.interface';
import { formatImgUri, formatCollectibleUri } from './image.utils';

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
  describe('formatCollectibleUri', () => {
    it('should convert asset KT and id to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 464017 } as TokenInterface;
      expect(formatCollectibleUri(collectible, 120)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/1/7/464017/thumb288`
      );
    });
    it('should convert asset KT and id to objkt.com URL for that asset with big size thumb', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 464017 } as TokenInterface;
      expect(formatCollectibleUri(collectible, 320)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/1/7/464017/thumb400`
      );
    });
    it('should convert asset KT and id with id < 10 to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 9 } as TokenInterface;
      expect(formatCollectibleUri(collectible, 120)).toEqual(
        `${objktOrigin}KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/0/9/9/thumb288`
      );
    });
  });
});
