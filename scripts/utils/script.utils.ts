export const getArgValue = (key: string) => {
  const keyIndex = process.argv.findIndex(v => v === key);

  if (keyIndex === -1) {
    throw new Error(`${key} required`);
  }

  const value = process.argv[keyIndex + 1];

  if (typeof value !== "string") {
    throw new Error(`Value for ${key} required`);
  }

  return value;
}
