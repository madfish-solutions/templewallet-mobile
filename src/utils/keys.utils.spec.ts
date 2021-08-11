import { mockAccountCredentials } from '../mocks/account-credentials.mock';
import { getDerivationPath, seedToHDPrivateKey, getPublicKeyAndHash$, generateSeed } from './keys.util';
import { rxJsTestingHelper } from './testing.utis';

it('getDerivationPath should return derivation path, passing account index', () => {
  expect(getDerivationPath(1)).toEqual(mockAccountCredentials.derivationPath);
});

it('seedToHDPrivateKey should return private key, passing seed and derivation path', () => {
  expect(
    seedToHDPrivateKey(new Buffer(mockAccountCredentials.seedPhrase), mockAccountCredentials.derivationPath)
  ).toEqual(mockAccountCredentials.privateKey);
});

it('seedToHDPrivateKey should return error, passing seed without derivation path', () => {
  expect(() => seedToHDPrivateKey(Buffer.from(mockAccountCredentials.seedPhrase), '')).toThrow(
    new Error('Invalid derivation path')
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

it('generateSeed should generate seed', () => {
  expect(generateSeed()).toEqual(mockAccountCredentials.seed);
});
