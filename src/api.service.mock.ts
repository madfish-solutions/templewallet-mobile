export const mockTokenMetadataApi = {
  get: jest.fn()
};

jest.mock('./api.service', () => ({
  tokenMetadataApi: mockTokenMetadataApi
}));
