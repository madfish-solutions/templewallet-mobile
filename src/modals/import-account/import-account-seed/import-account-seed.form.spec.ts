import { mockAccountCredentials } from 'src/mocks/account-credentials.mock';

import {
  importAccountSeedDerivationPathPlaceholder,
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema
} from './import-account-seed.form';

describe('importAccountSeed form', () => {
  it('should use empty derivation path by default and provide an EVM placeholder', () => {
    expect(importAccountSeedInitialValues.derivationPath).toEqual('');
    expect(importAccountSeedDerivationPathPlaceholder).toEqual("m/44'/60'/0'/0/0");
  });

  it('should allow empty derivation path', async () => {
    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: ''
      })
    ).resolves.toEqual(true);
  });

  it('should validate custom EVM, Tezos, and arbitrary coin type paths', async () => {
    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "m/44'/60'/0'/0/1"
      })
    ).resolves.toEqual(true);

    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "m/44'/1729'/0'/0'"
      })
    ).resolves.toEqual(true);

    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "m/44'/999'/0'/0'"
      })
    ).resolves.toEqual(true);
  });

  it('should reject syntactically invalid derivation paths', async () => {
    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "44'/60'/0'/0/0"
      })
    ).resolves.toEqual(false);

    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "m-44'/60'/0'/0/0"
      })
    ).resolves.toEqual(false);

    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        derivationPath: "m/44'/coin'/0'/0/0"
      })
    ).resolves.toEqual(false);
  });
});
