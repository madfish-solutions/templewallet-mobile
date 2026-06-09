import { string } from 'yup';

export const derivationPathValidation = string().test('validateDerivationPath', 'Invalid derivation path', path => {
  const trimmedPath = path?.trim();

  if (!trimmedPath) {
    return true;
  }

  if (!trimmedPath.startsWith('m')) {
    return false;
  }

  if (trimmedPath.length > 1 && trimmedPath[1] !== '/') {
    return false;
  }

  return trimmedPath
    .replace('m', '')
    .split('/')
    .filter(Boolean)
    .every(pathPart => {
      const pathPartNumber = Number(pathPart.endsWith("'") ? pathPart.slice(0, -1) : pathPart);

      return Number.isSafeInteger(pathPartNumber) && pathPartNumber >= 0;
    });
});
