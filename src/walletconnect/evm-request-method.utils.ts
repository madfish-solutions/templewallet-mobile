import {
  isWcModernTypedDataRequestContent,
  isWcOldTypedDataRequestContent,
  isWcPersonalSignRequestContent,
  isWcSendTransactionRequestContent,
  StrictWcSessionRequestContent
} from 'src/types/strict-wc-session-request';

/**
 * Best-effort extraction of the request's authorizing address from raw JSON-RPC params.
 * Returns `undefined` when the method has no address in params or the shape is unexpected.
 */
export const getWcRequestAddress = (requestContent: StrictWcSessionRequestContent): string | undefined => {
  if (isWcSendTransactionRequestContent(requestContent)) {
    return requestContent.params[0].from;
  }

  if (isWcPersonalSignRequestContent(requestContent) || isWcOldTypedDataRequestContent(requestContent)) {
    return requestContent.params[1];
  }

  if (isWcModernTypedDataRequestContent(requestContent)) {
    return requestContent.params[0];
  }

  return undefined;
};
