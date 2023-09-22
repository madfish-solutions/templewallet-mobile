import { mockAccountCredentials, mockInvalidPrivateKey } from './account-credentials.mock';

export const mockInMemorySigner = {
  secretKey: jest.fn(() => Promise.resolve(mockAccountCredentials.privateKey)),
  publicKey: jest.fn(() => Promise.resolve(mockAccountCredentials.publicKey)),
  publicKeyHash: jest.fn(() => Promise.resolve(mockAccountCredentials.publicKeyHash))
};

jest.mock('@taquito/signer', () => {
  class InMemorySigner {
    static fromSecretKey = jest.fn(privateKey => {
      return privateKey === mockInvalidPrivateKey
        ? Promise.reject('wrong private key')
        : Promise.resolve(mockInMemorySigner);
    });
    secretKey = jest.fn(() => Promise.resolve(mockAccountCredentials.privateKey));
    publicKey = jest.fn(() => Promise.resolve(mockAccountCredentials.publicKey));
    publicKeyHash = jest.fn(() => Promise.resolve(mockAccountCredentials.publicKeyHash));
  }

  return { InMemorySigner };
});
