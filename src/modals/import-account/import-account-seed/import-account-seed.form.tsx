import { isValidPath } from 'ed25519-hd-key';
import { mixed, object, SchemaOf, string } from 'yup';

import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { seedPhraseValidation } from 'src/form/validation/seed-phrase';
import { isDefined } from 'src/utils/is-defined';
import { getEvmDerivationPath, getTezosDerivationPath, isValidEvmDerivationPath } from 'src/utils/keys.util';

export type ImportAccountSeedValues = {
  seedPhrase: string;
  password?: string;
  chain: TempleChainKind;
  derivationType: ImportAccountDerivationEnum;
  derivationPath?: string;
};

export const importAccountSeedInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  password: '',
  chain: TempleChainKind.Tezos,
  derivationType: ImportAccountDerivationEnum.DEFAULT,
  derivationPath: getTezosDerivationPath(0)
};

export const importAccountSeedValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  password: string(),
  chain: mixed<TempleChainKind>().oneOf(Object.values(TempleChainKind)).required(),
  derivationType: mixed<ImportAccountDerivationEnum>().oneOf(Object.values(ImportAccountDerivationEnum)).required(),
  derivationPath: string().test('validateDerivationPath', 'Invalid derivation path', function (path) {
    if (!isDefined(path)) {
      return true;
    }

    return this.parent.chain === TempleChainKind.EVM ? isValidEvmDerivationPath(path) : isValidPath(path);
  })
});

export const getDefaultImportAccountSeedDerivationPath = (chain: TempleChainKind) =>
  chain === TempleChainKind.EVM ? getEvmDerivationPath(0) : getTezosDerivationPath(0);
