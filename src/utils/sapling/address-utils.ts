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

/** Extracts the account index from a tezos derivation path like m/44'/1729'/{index}'/0' */
export function extractHdIndexFromDerivationPath(derivationPath?: string): number | undefined {
  if (!derivationPath) {
    return undefined;
  }

  const match = derivationPath.match(/^m\/44'\/1729'\/(\d+)'\/0'$/);

  return match ? Number(match[1]) : undefined;
}
