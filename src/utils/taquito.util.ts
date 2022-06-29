import { validateAddress, ValidationResult } from '@taquito/utils';

export function isAddressValid(address: string) {
  return validateAddress(address) === ValidationResult.VALID;
}
