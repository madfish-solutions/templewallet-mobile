import { hexToString } from 'viem';

import {
  isWcOldTypedDataRequestContent,
  isWcPersonalSignRequestContent,
  StrictWcSigningRequestContent
} from 'src/types/strict-wc-session-request';

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
export const getWcSigningPayloadPreview = (requestContent: StrictWcSigningRequestContent) => {
  if (isWcPersonalSignRequestContent(requestContent)) {
    return tryHexToUtf8(requestContent.params[0]);
  }

  if (isWcOldTypedDataRequestContent(requestContent)) {
    return prettyJson(requestContent.params[0]);
  }

  return prettyJson(requestContent.params[1]);
};
