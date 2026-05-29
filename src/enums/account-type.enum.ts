export enum AccountTypeEnum {
  HD = 'HD',
  IMPORTED_CHAIN = 'IMPORTED_CHAIN',
  IMPORTED_MULTICHAIN = 'IMPORTED_MULTICHAIN',
  WATCH_ONLY_DEBUG = 'WATCH_ONLY_DEBUG',

  /** @deprecated */
  IMPORTED = 'IMPORTED'
}

export enum ImportAccountDerivationEnum {
  DEFAULT = 'DEFAULT',
  CUSTOM_PATH = 'CUSTOM_PATH'
}
