import { b58DecodeAndCheckPrefix, PrefixV2 } from '@taquito/utils';

/**
 * Check if an address is a sapling (shielded) address (zet1 prefix).
 */
export const isSaplingAddress = (address: string): boolean => {
  try {
    b58DecodeAndCheckPrefix(address, [PrefixV2.SaplingAddress]);

    return true;
  } catch {
    return false;
  }
};

export function getSaplingDerivationPath(hdIndex?: number): string | undefined {
  return hdIndex ? `m/44'/1729'/${hdIndex}'/0'` : undefined;
}
