export const mockTezosMetadataApi = {
  get: jest.fn()
};

jest.mock('./api.service', () => ({
  tezosMetadataApi: mockTezosMetadataApi
}));
