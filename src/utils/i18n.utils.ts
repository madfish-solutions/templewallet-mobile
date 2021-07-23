// TODO: replace all this functionality as soon as i18n that requires using hooks or store appears
export const makeRequiredErrorMessage = (fieldName: string) => `"${fieldName}" is a required field`;

const ordinalFormatter = new Intl.PluralRules('en-US', {
  type: 'ordinal'
});

const suffixes: Record<Intl.LDMLPluralRule, string> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
  zero: 'th',
  many: 'th'
};

export const formatOrdinalNumber = (n: number) => `${n}${suffixes[ordinalFormatter.select(n)]}`;
