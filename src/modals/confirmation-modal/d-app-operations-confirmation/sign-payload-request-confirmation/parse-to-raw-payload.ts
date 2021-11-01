import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { localForger } from '@taquito/local-forging';
import { valueDecoder } from '@taquito/local-forging/dist/lib/michelson/codec';
import { Uint8ArrayConsumer } from '@taquito/local-forging/dist/lib/uint8array-consumer';
import { emitMicheline } from '@taquito/michel-codec';

const TEZ_MSG_SIGN_PATTERN = /^0501[a-f0-9]{8}54657a6f73205369676e6564204d6573736167653a20[a-f0-9]*$/;

export const parseToRawPayload = async (message: SignPayloadRequestOutput) => {
  let rawPayload;
  try {
    if (message.payload.match(TEZ_MSG_SIGN_PATTERN)) {
      rawPayload = emitMicheline(valueDecoder(Uint8ArrayConsumer.fromHexString(message.payload.slice(2))), {
        indent: '  ',
        newline: '\n'
      }).slice(1, -1);
    } else {
      const parsed = await localForger.parse(message.payload);
      if (parsed.contents.length > 0) {
        rawPayload = parsed;
      }
    }
  } catch {
    rawPayload = null;
  }

  return rawPayload;
};
