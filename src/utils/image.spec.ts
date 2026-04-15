import { buildTokenImagesStack, formatImgUri, isImgUriSvg } from './image.utils';

describe('image utils', () => {
  describe('formatImgUri', () => {
    it('should proxy plain http urls through tcinfra media host', () => {
      const mockHttpUri = 'http://mocklink.com';
      const mockHttpsUri = 'https://static.tcinfra.net/media/small/web/mocklink.com';

      expect(formatImgUri(mockHttpUri)).toEqual(mockHttpsUri);
    });

    it('should convert ipfs:// uri to https://', () => {
      const mockIpfsUri = 'ipfs://mockFileHash';
      const mockHttpsUri = 'https://static.tcinfra.net/media/small/ipfs/mockFileHash';

      expect(formatImgUri(mockIpfsUri)).toEqual(mockHttpsUri);
    });

    it('should replace cloudflare-ipfs.com with ipfs.filebase.io', () => {
      const mockCloudflareUri = 'https://cloudflare-ipfs.com/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx';
      const mockIpfsUri = 'https://ipfs.filebase.io/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx';

      expect(formatImgUri(mockCloudflareUri)).toEqual(mockIpfsUri);
    });

    it('should keep the original http url when media host is disabled', () => {
      const mockHttpUri = 'https://other-ipfs-gateway.com/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx';

      expect(formatImgUri(mockHttpUri, 'medium', false)).toEqual(mockHttpUri);
    });
  });

  describe('buildTokenImagesStack', () => {
    it('should include tcinfra web proxies for http ipfs gateway urls', () => {
      const mockCloudflareUri = 'https://ipfs.filebase.io/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx';

      expect(buildTokenImagesStack(mockCloudflareUri)).toEqual([
        'https://static.tcinfra.net/media/small/web/ipfs.filebase.io/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx',
        'https://static.tcinfra.net/media/medium/web/ipfs.filebase.io/ipfs/QmfEbirSA7indrEzjFAtJ589oChBFrqLio9kwpJwR4ttHx',
        mockCloudflareUri
      ]);
    });
  });

  describe('is image svg', () => {
    it('should return true for img address with .svg', () => {
      expect(isImgUriSvg('https://facebook.com/favicon.svg')).toEqual(true);
    });
    it('should return true for img address with .svg query params', () => {
      expect(isImgUriSvg('https://facebook.com/favicon.svg?v=2')).toEqual(true);
    });
    it('should return false for img address with .png', () => {
      expect(isImgUriSvg('https://facebook.com/favicon.png')).toEqual(false);
    });
  });
});
