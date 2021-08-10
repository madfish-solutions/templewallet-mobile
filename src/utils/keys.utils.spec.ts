import { getDerivationPath } from './keys.util';

describe('seedToPrivateKey', () => {
  it('should return derivation path, passing account index', () => {
    expect(getDerivationPath(1)).toEqual("m/44'/1729'/1'/0'");
  });
});
