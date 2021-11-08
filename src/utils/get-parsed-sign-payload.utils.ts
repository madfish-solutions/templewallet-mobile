import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { Uint8ArrayConsumer } from '@taquito/local-forging';
import { valueDecoder } from '@taquito/local-forging/dist/lib/michelson/codec';
import { emitMicheline } from '@taquito/michel-codec';

const TEZ_MSG_SIGN_PATTERN = /^0501[a-f0-9]{8}54657a6f73205369676e6564204d6573736167653a20[a-f0-9]*$/;

export const getParsedSignPayload = async (message: SignPayloadRequestOutput) => {
  let parsedPayload = '';
  if (message.payload.match(TEZ_MSG_SIGN_PATTERN)) {
    parsedPayload = emitMicheline(valueDecoder(Uint8ArrayConsumer.fromHexString(message.payload.slice(2))), {
      indent: '  ',
      newline: '\n'
    }).slice(1, -1);
  }

  return parsedPayload;
};
