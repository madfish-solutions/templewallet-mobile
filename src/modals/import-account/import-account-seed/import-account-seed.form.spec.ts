import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { mockAccountCredentials } from 'src/mocks/account-credentials.mock';

import {
  getDefaultImportAccountSeedDerivationPath,
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema
} from './import-account-seed.form';

describe('importAccountSeed form', () => {
  it('should use Tezos as the default chain and path', () => {
    expect(importAccountSeedInitialValues.chain).toEqual(TempleChainKind.Tezos);
    expect(importAccountSeedInitialValues.derivationPath).toEqual("m/44'/1729'/0'/0'");
    expect(getDefaultImportAccountSeedDerivationPath(TempleChainKind.Tezos)).toEqual("m/44'/1729'/0'/0'");
  });

  it('should provide the EVM default path', () => {
    expect(getDefaultImportAccountSeedDerivationPath(TempleChainKind.EVM)).toEqual("m/44'/60'/0'/0/0");
  });

  it("should validate an EVM custom m/44'/60' path", async () => {
    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        password: '',
        chain: TempleChainKind.EVM,
        derivationType: ImportAccountDerivationEnum.CUSTOM_PATH,
        derivationPath: "m/44'/60'/0'/0/1"
      })
    ).resolves.toEqual(true);
  });

  it('should reject non-EVM paths for EVM seed imports', async () => {
    await expect(
      importAccountSeedValidationSchema.isValid({
        seedPhrase: mockAccountCredentials.seedPhrase,
        password: '',
        chain: TempleChainKind.EVM,
        derivationType: ImportAccountDerivationEnum.CUSTOM_PATH,
        derivationPath: "m/44'/1729'/0'/0'"
      })
    ).resolves.toEqual(false);
  });
});
