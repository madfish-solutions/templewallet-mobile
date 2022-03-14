export const mockCrypto = {
  encryptString$: jest.fn(),
  decryptString$: jest.fn(),
};

global.crypto = mockCrypto;
