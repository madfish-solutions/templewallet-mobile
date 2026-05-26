import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import {
  generateSeed,
  getEvmDerivationPath,
  getPublicKeyAndHash$,
  getTezosDerivationPath,
  isEvmDerivationPath,
  isValidEvmDerivationPath,
  mnemonicToEvmAccountCreds,
  mnemonicToPrivateKey,
  mnemonicToTezosAccountCreds,
  privateKeyToEvmAccountCreds,
  seedToPrivateKey
} from './keys.utils';
import { rxJsTestingHelper } from './testing.utils';

const mockEvmAddressIndexZero = '0xfDc237eff648793c9F3B976c702493f0EE056489';
const mockEvmPrivateKeyIndexZero = '0x3925ef64b24414526bd9d28826c642a34d4d8fbb292b467a33f5376126632d3d';
const mockEvmPrivateKeyIndexOne = '0xec90061805584475c77bc57b9cf5a918f279dc4cddf365820dae472348bf405b';

it('getDerivationPath should return derivation path, passing account index', () => {
  expect(getTezosDerivationPath(1)).toEqual(mockAccountCredentials.derivationPath);
});

it('getDerivationPath should return Tezos derivation path', () => {
  expect(getTezosDerivationPath(1)).toEqual(getTezosDerivationPath(1));
});

it('getEvmDerivationPath should return EVM derivation path, passing account index', () => {
  expect(getEvmDerivationPath(1)).toEqual("m/44'/60'/0'/0/1");
});

it('isEvmDerivationPath should return true for EVM derivation path', () => {
  expect(isEvmDerivationPath("m/44'/60'/0'/0/1")).toEqual(true);
  expect(isEvmDerivationPath(mockAccountCredentials.derivationPath)).toEqual(false);
});

it('isValidEvmDerivationPath should validate custom EVM derivation paths', () => {
  expect(isValidEvmDerivationPath("m/44'/60'/0'/0/0")).toEqual(true);
  expect(isValidEvmDerivationPath("m/44'/60'/x")).toEqual(false);
  expect(isValidEvmDerivationPath(mockAccountCredentials.derivationPath)).toEqual(false);
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

it('mnemonicToTezosAccountCreds should preserve Tezos derivation output', async () => {
  await expect(mnemonicToTezosAccountCreds(mockAccountCredentials.seedPhrase, 0)).resolves.toEqual({
    address: mockAccountCredentials.publicKeyHash,
    publicKey: mockAccountCredentials.publicKey,
    privateKey: 'edsk42B5mxHfZWnnmEFAEHcZvMwD7CH673F3s2NQkCQ5n6SXD8Vxqp'
  });
});

it('mnemonicToEvmAccountCreds should return EVM account credentials for index 0', () => {
  expect(mnemonicToEvmAccountCreds(mockAccountCredentials.seedPhrase, 0)).toEqual({
    address: mockEvmAddressIndexZero,
    publicKey:
      '0x0499d1bccb7edd00944e5c0aec8375dc99faae3bbf1680b43facf89ad68f228592fd7118af99ae94d632b2a96593b8440253d8f4933c02b8725a97daa57d9a1aa9',
    privateKey: mockEvmPrivateKeyIndexZero
  });
});

it("mnemonicToEvmAccountCreds should use m/44'/60'/0'/0/{index} for EVM account credentials", () => {
  expect(mnemonicToEvmAccountCreds(mockAccountCredentials.seedPhrase, 1).privateKey).toEqual(mockEvmPrivateKeyIndexOne);
  expect(
    mnemonicToPrivateKey(
      mockAccountCredentials.seedPhrase,
      message => new Error(message),
      undefined,
      getEvmDerivationPath(1)
    ).privateKey
  ).toEqual(mockEvmPrivateKeyIndexOne);
});

it('mnemonicToPrivateKey should return EVM private key for custom EVM derivation path', () => {
  expect(
    mnemonicToPrivateKey(
      mockAccountCredentials.seedPhrase,
      message => new Error(message),
      undefined,
      getEvmDerivationPath(0)
    )
  ).toEqual({
    chain: TempleChainKind.EVM,
    privateKey: mockEvmPrivateKeyIndexZero
  });
});

it('mnemonicToPrivateKey should return Tezos private key for custom Tezos derivation path', () => {
  expect(
    mnemonicToPrivateKey(
      mockAccountCredentials.seedPhrase,
      message => new Error(message),
      undefined,
      getTezosDerivationPath(0)
    )
  ).toEqual({
    chain: TempleChainKind.Tezos,
    privateKey: 'edsk42B5mxHfZWnnmEFAEHcZvMwD7CH673F3s2NQkCQ5n6SXD8Vxqp'
  });
});

it('privateKeyToEvmAccountCreds should return EVM account credentials from private key', () => {
  expect(privateKeyToEvmAccountCreds(mockEvmPrivateKeyIndexZero)).toEqual({
    address: mockEvmAddressIndexZero,
    publicKey:
      '0x0499d1bccb7edd00944e5c0aec8375dc99faae3bbf1680b43facf89ad68f228592fd7118af99ae94d632b2a96593b8440253d8f4933c02b8725a97daa57d9a1aa9',
    privateKey: mockEvmPrivateKeyIndexZero
  });
});

it('privateKeyToEvmAccountCreds should throw a useful error for non-hex private key', () => {
  expect(() => privateKeyToEvmAccountCreds('not-a-private-key')).toThrow(
    'EVM private key must be a 0x-prefixed hex value'
  );
});

it('privateKeyToEvmAccountCreds should throw a useful error for invalid hex private key', () => {
  expect(() => privateKeyToEvmAccountCreds('0x123')).toThrow('Invalid EVM private key');
});

it('generateSeed should generate seed', async () => {
  await expect(generateSeed()).resolves.toEqual(mockAccountCredentials.seed);
});
