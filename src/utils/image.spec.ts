import {
  formatImgUri,
  isImgUriSvg,
  formatCollectibleObjktMediumUri,
  formatCollectibleObjktBigUri
} from './image.utils';

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

    it('should convert ipfs:// uri to URL to cloudflare-ipfs.com for that file', () => {
      expect(formatImgUri('ipfs://mockFileHash')).toEqual('https://cloudflare-ipfs.com/ipfs/mockFileHash/');
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
  describe('formatCollectibleObjktBigUri', () => {
    it('should convert asset KT and id to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 464017 };
      const assetSlug = `${collectible.address}_${collectible.id}`;
      expect(formatCollectibleObjktBigUri(assetSlug)).toEqual(
        `https://assets.objkt.media/file/assets-001/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/1/7/464017/thumb400`
      );
    });
    it('should convert asset KT and id with id < 10 to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 9 };
      const assetSlug = `${collectible.address}_${collectible.id}`;
      expect(formatCollectibleObjktBigUri(assetSlug)).toEqual(
        `https://assets.objkt.media/file/assets-001/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/0/9/9/thumb400`
      );
    });
  });
  describe('formatCollectibleObjktMediumUri', () => {
    it('should convert asset KT and id to objkt.com URL for that asset', () => {
      const collectible = { address: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', id: 464017 };
      const assetSlug = `${collectible.address}_${collectible.id}`;
      expect(formatCollectibleObjktMediumUri(assetSlug)).toEqual(
        `https://assets.objkt.media/file/assets-001/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/464017/thumb288`
      );
    });
  });
});
