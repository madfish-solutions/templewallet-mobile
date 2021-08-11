import { Shelter } from './shelter';
import { rxJsTestingHelper } from '../utils/testing.utis';

describe('Shelter', () => {
  const mockCorrectPassword = 'mockCorrectPassword';

  it('should initially lock app & be unable to decrypt data', done => {
    Shelter.isLocked$.subscribe(rxJsTestingHelper(isLocked => expect(isLocked).toEqual(true), done));
  });

  it('should not unlock app with incorrect password & be unable to decrypt data', () => {
    Shelter.unlockApp$(mockCorrectPassword);
  });

  it('should unlock app with correct password & be able to decrypt data', () => {
  });

  it('should lock app & be unable to decrypt data', () => {
  });

  it('should import HD account', () => {
  });

  it('should create HD account', () => {
  });

  it('should create Imported account', () => {
  });

  it('should reveal HD account seed phrase', () => {
  });

  it('should reveal account private key', () => {
  });

  it('should return signer with private key', () => {
  });

  it('should save password into Keychain if biometry enabled', () => {
  });

  it('should not save password into Keychain if biometry disabled', () => {
  });

  it('should reveal password from Keychain', () => {
  });

  it('should remove password from Keychain', () => {
  });

  it('should validate password', () => {
  });
});
