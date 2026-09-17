export const mockTezosMetadataApi = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('./api.service', () => ({
  tezosMetadataApi: mockTezosMetadataApi
}));
