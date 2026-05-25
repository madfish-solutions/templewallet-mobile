import { mixed, object, SchemaOf, string } from 'yup';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';

export interface ImportAccountPrivateKeyValues {
  privateKey: string;
  chain: TempleChainKind;
}

export const importAccountPrivateKeyValidationSchema: SchemaOf<ImportAccountPrivateKeyValues> = object().shape({
  chain: mixed<TempleChainKind>().oneOf(Object.values(TempleChainKind)).required(),
  privateKey: string().required(makeRequiredErrorMessage('Private key'))
});

export const importAccountPrivateKeyInitialValues: ImportAccountPrivateKeyValues = {
  privateKey: '',
  chain: TempleChainKind.Tezos
};
