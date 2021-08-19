import { mockAccountCredentials } from './account-credentials.mock';

export const mockInMemorySigner = {
  secretKey: jest.fn(() => Promise.resolve(mockAccountCredentials.privateKey)),
  publicKey: jest.fn(() => Promise.resolve(mockAccountCredentials.publicKey)),
  publicKeyHash: jest.fn(() => Promise.resolve(mockAccountCredentials.publicKeyHash))
};

jest.mock('@taquito/signer', () => ({
  InMemorySigner: class {
    static fromSecretKey = jest.fn(() => Promise.resolve(mockInMemorySigner));
    secretKey = jest.fn(() => Promise.resolve(mockAccountCredentials.privateKey));
    publicKey = jest.fn(() => Promise.resolve(mockAccountCredentials.publicKey));
    publicKeyHash = jest.fn(() => Promise.resolve(mockAccountCredentials.publicKeyHash));
  }
}));
