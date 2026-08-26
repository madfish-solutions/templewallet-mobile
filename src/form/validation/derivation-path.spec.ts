import { derivationPathValidation } from './derivation-path';

describe('derivationPathValidation', () => {
  it('should allow empty derivation path', async () => {
    await expect(derivationPathValidation.isValid('')).resolves.toEqual(true);
  });

  it('should validate custom EVM, Tezos, and arbitrary coin type paths', async () => {
    await expect(derivationPathValidation.isValid("m/44'/60'/0'/0/1")).resolves.toEqual(true);
    await expect(derivationPathValidation.isValid("m/44'/1729'/0'/0'")).resolves.toEqual(true);
    await expect(derivationPathValidation.isValid("m/44'/999'/0'/0'")).resolves.toEqual(true);
  });

  it('should reject syntactically invalid derivation paths', async () => {
    await expect(derivationPathValidation.isValid("44'/60'/0'/0/0")).resolves.toEqual(false);
    await expect(derivationPathValidation.isValid("m-44'/60'/0'/0/0")).resolves.toEqual(false);
    await expect(derivationPathValidation.isValid("m/44'/coin'/0'/0/0")).resolves.toEqual(false);
  });
});
