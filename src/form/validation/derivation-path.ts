import { string } from 'yup';

const derivationPathPartRegex = /^(\d+)'?$/;

export const derivationPathValidation = string().test('validateDerivationPath', 'Invalid path', path => {
  const p = path ?? '';

  if (p.length === 0) return true;
  if (!p.startsWith('m')) {
    return false;
  }
  if (p.length > 1 && p[1] !== '/') {
    return false;
  }

  const parts = p.split('/').slice(1);

  return parts.every(itemPart => {
    const execResult = derivationPathPartRegex.exec(itemPart);
    if (!execResult) return false;

    const [, pNumStr] = execResult;
    const pNum = +pNumStr;

    return Number.isSafeInteger(pNum) && pNum >= 0;
  });
});
