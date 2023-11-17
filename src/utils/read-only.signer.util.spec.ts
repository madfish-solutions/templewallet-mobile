import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { ReadOnlySigner } from './read-only.signer.util';

describe('ReadOnlySigner', () => {
  const readOnlySigner = new ReadOnlySigner(mockAccountCredentials.publicKeyHash, mockAccountCredentials.publicKey);

  it('should return public key', async () => {
    await expect(readOnlySigner.publicKey()).resolves.toEqual(mockAccountCredentials.publicKey);
  });
  it('should return public key hash', async () => {
    await expect(readOnlySigner.publicKeyHash()).resolves.toEqual(mockAccountCredentials.publicKeyHash);
  });
  it('should throw error on requesting private key', async () => {
    await expect(readOnlySigner.secretKey()).rejects.toThrowError('Secret key cannot be exposed');
  });
  it('should throw error on sign call', async () => {
    await expect(readOnlySigner.sign()).rejects.toThrowError('Cannot sign');
  });
});
