import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { useEffect, useState } from 'react';

import { getParsedSignPayload } from '../utils/get-parsed-sign-payload.utils';
import { isString } from '../utils/is-string';

export const useParseSignPayload = (message: SignPayloadRequestOutput) => {
  const [payloadPreview, setPayloadPreview] = useState('');
  const isPayloadParsed = isString(payloadPreview);

  useEffect(() => void getParsedSignPayload(message).then(payload => setPayloadPreview(payload)), [message]);

  return { payloadPreview, isPayloadParsed };
};
