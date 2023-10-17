import { formatImgUri, isImgUriSvg, formatCollectibleObjktMediumUri } from './image.utils';

describe('image utils', () => {
  describe('formatImgUri', () => {
    it('should convert http:// to https://', () => {
      const mockHttpUri = 'http://mocklink.com';
      const mockHttpsUri = 'https://static.tcinfra.net/media/small/web/mocklink.com';

      expect(formatImgUri(mockHttpUri)).toEqual(mockHttpsUri);
    });

    it('should convert ipfs:// uri to https://', () => {
      const mockIpfsUri = 'ipfs://mockFileHash';
      const mockHttpsUri = 'https://static.tcinfra.net/media/small/ipfs/mockFileHash';

      expect(formatImgUri(mockIpfsUri)).toEqual(mockHttpsUri);
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

  describe('formatCollectibleObjktMediumUri', () => {
    it('should convert asset KT and id to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 464017 };
      const assetSlug = `${collectible.address}_${collectible.id}`;
      expect(formatCollectibleObjktMediumUri(assetSlug)).toEqual(
        `https://assets.objkt.media/file/assets-003/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/464017/thumb288`
      );
    });
  });
});
