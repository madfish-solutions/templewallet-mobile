export const mockCrypto = {
  getRandomValues: jest.fn()
};

global.crypto = mockCrypto;
