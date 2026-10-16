import { string } from 'yup';

import { isTruthy } from 'src/utils/is-truthy.ts';

export const derivationPathValidation = string().test('validateDerivationPath', 'Invalid path', path => {
  const p = path ?? '';

  if (p.length === 0) return true;
  if (!p.startsWith('m')) {
    return false;
  }
  if (p.length > 1 && p[1] !== '/') {
    return false;
  }

  const parts = p.replace('m', '').split('/').filter(isTruthy);

  return parts.every(itemPart => {
    const pNum = +(itemPart.includes("'") ? itemPart.replace("'", '') : itemPart);

    return Number.isSafeInteger(pNum) && pNum >= 0;
  });
});
