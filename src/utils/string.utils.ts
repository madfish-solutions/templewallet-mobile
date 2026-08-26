export const calculateStringSizeInBytes = (value: string) => Buffer.byteLength(value, 'utf8');

export const includesIgnoreCase = (value: string, searchValue: string) =>
  value.toLowerCase().includes(searchValue.toLowerCase());
