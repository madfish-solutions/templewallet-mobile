import { hexToString } from 'viem';

import {
  validateOldSignTypedDataParams,
  validatePersonalSignParams,
  validateSignTypedDataParams
} from 'src/utils/evm/validation-schemas';

import { isWcOldTypedDataMethod, isWcSigningMethod, isWcTypedDataMethod } from './evm-request-method.utils';

const prettyJson = (value: unknown) => JSON.stringify(value, null, 2);

const tryHexToUtf8 = (hex: HexString) => {
  try {
    return hexToString(hex);
  } catch {
    return undefined;
  }
};

/**
 * Human-readable payload for WalletConnect signing confirmations.
 * Falls back to raw params JSON when validation fails.
 */
export const getWcSigningPayloadPreview = (method: string, params: unknown) => {
  if (!isWcSigningMethod(method)) {
    return prettyJson(params);
  }

  try {
    if (method === 'personal_sign') {
      const [message] = validatePersonalSignParams(params);

      return tryHexToUtf8(message);
    }

    if (isWcOldTypedDataMethod(method)) {
      const [typedData] = validateOldSignTypedDataParams(params);

      return prettyJson(typedData);
    }

    if (isWcTypedDataMethod(method)) {
      const [, typedData] = validateSignTypedDataParams(params);

      return prettyJson(typedData);
    }
  } catch {
    // Keep a readable fallback for malformed requests.
  }

  return prettyJson(params);
};
