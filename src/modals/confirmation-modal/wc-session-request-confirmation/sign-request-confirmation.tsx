import { FC, useMemo } from 'react';

import { isWcPersonalSignRequestContent, StrictWcSigningRequestContent } from 'src/types/strict-wc-session-request';
import { isDefined } from 'src/utils/is-defined';
import { getWcSigningPayloadPreview } from 'src/walletconnect/get-wc-signing-payload-preview';

import {
  SignRequestConfirmationContent,
  SignRequestConfirmationContentProps
} from '../common/sign-request-confirmation-content';

interface EvmSignRequestConfirmationProps
  extends Omit<SignRequestConfirmationContentProps, 'payloadPreview' | 'bytesPayload'> {
  requestContent: StrictWcSigningRequestContent;
}

export const EvmSignRequestConfirmation: FC<EvmSignRequestConfirmationProps> = ({ requestContent, ...restProps }) => {
  const payloadPreview = useMemo(() => getWcSigningPayloadPreview(requestContent), [requestContent]);
  const bytesPayload = useMemo(
    () =>
      isWcPersonalSignRequestContent(requestContent) && !isDefined(payloadPreview)
        ? requestContent.params[0]
        : undefined,
    [requestContent, payloadPreview]
  );

  return <SignRequestConfirmationContent {...restProps} payloadPreview={payloadPreview} bytesPayload={bytesPayload} />;
};
