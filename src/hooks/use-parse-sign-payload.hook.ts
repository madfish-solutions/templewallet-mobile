import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { useEffect, useState } from 'react';

import { parseSignPayload } from '../utils/parse-sign-payload.utils';

export const useParseSignPayloadHook = (message: SignPayloadRequestOutput) => {
  const [parsedPayload, setParsedPayload] = useState('');

  useEffect(() => void parseSignPayload(message).then(parsedPayload => setParsedPayload(parsedPayload)), [message]);

  return parsedPayload;
};
