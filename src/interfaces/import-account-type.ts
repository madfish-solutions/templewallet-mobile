export enum ImportAccountTypeEnum {
  PRIVATE_KEY = 'PRIVATE_KEY',
  SEED_PHRASE = 'SEED_PHRASE'
}

export enum ImportAccountDerivationEnum {
  DEFAULT = 'DEFAULT',
  CUSTOM_PATH = 'CUSTOM_PATH'
}

export type ImportAccountTypeValues = {
  type: ImportAccountTypeEnum;
};

export type ImportAccountSeedValues = {
  seedPhrase: string;
  password?: string;
  derivation?: string;
  derivationPath: string;
};

export type ImportAccountPrivateKeyValues = {
  privateKey: '';
};
