import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { getDerivationPath, seedToPrivateKey, getPublicKeyAndHash$, generateSeed } from './keys.util';
import { rxJsTestingHelper } from './testing.utis';

it('getDerivationPath should return derivation path, passing account index', () => {
  expect(getDerivationPath(1)).toEqual(mockAccountCredentials.derivationPath);
});

it('seedToPrivateKey should return private key, passing seed and derivation path', () => {
  expect(
    seedToPrivateKey(Buffer.from(mockAccountCredentials.seedPhrase), mockAccountCredentials.derivationPath)
  ).toEqual(mockAccountCredentials.privateKey);
});

it('seedToHDPrivateKey should return private key, passing seed without derivation path', () => {
  expect(seedToPrivateKey(Buffer.from(mockAccountCredentials.seedPhrase), '')).toEqual(
    mockAccountCredentials.privateKeyWithoutDerivationPath
  );
});

it('getPublicKeyAndHash$ should return publicKey and publicKeyHash, passing privateKey', done => {
  getPublicKeyAndHash$(mockAccountCredentials.privateKey).subscribe(
    rxJsTestingHelper(([publicKey, publicKeyHash]) => {
      expect(publicKey).toEqual(mockAccountCredentials.publicKey);
      expect(publicKeyHash).toEqual(mockAccountCredentials.publicKeyHash);
    }, done)
  );
});

it('generateSeed should generate seed', async () => {
  await expect(generateSeed()).resolves.toEqual(mockAccountCredentials.seed);
});
