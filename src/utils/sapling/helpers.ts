import toBuffer from 'typedarray-to-buffer';

export function toBase64(input: Buffer | ArrayBufferView) {
  if (input instanceof Buffer) {
    return input.toString('base64');
  }

  return toBuffer(input).toString('base64');
}

export function bufToUint8Array(buffer: Buffer) {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}
