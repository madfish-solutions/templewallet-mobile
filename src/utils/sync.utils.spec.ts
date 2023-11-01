import { SyncPayloadInterface } from '../interfaces/sync.interface';
import { mockReactNativeThemis } from '../mocks/react-native-themis.mock';

import { isSyncPayload, parseSyncPayload, TEMPLE_SYNC_PREFIX } from './sync.utils';

const prefixB64 = Buffer.from(TEMPLE_SYNC_PREFIX).toString('base64');
const pseudoValidPayload = [prefixB64, Buffer.from(new Uint8Array(49)).toString('base64')].join('');

const validPayload =
  'dGVtcGxlc3luYw==D0kc+UoX+AKlIxrjp3veaA==Hl6o92drp1DKZ6TjXCuEIw==nQdMscP50GNdZpfC3GPWBPqNuVFsWn98rNJj5hYQnCmbZ/3Gr1LxEgUS4fOwBWRMlLuHjLOKWP04sqjuIi8wXkhcqbr5RDspav0kkB2C98Jj5n235uBufYIGDSKufjHo';
const validPassword = '123qweasd';
const validParsed: SyncPayloadInterface = {
  mnemonic: 'elbow blood dial initial shaft average upgrade erupt spray basket fall uncle',
  hdAccountsLength: 3
};

const FAILED_TO_DECRYPT_ERROR = 'Failed to decrypt sync payload';

describe('isSyncPayload', () => {
  it('should false when random payload', () => {
    expect(isSyncPayload('10101010')).toEqual(false);
  });
  it('should false when utf8 prefix', () => {
    expect(isSyncPayload(TEMPLE_SYNC_PREFIX)).toEqual(false);
  });
  it('should false when only prefix', () => {
    expect(isSyncPayload(prefixB64)).toEqual(false);
  });
  it('should true when length > 64 and valid prefix', () => {
    expect(isSyncPayload(pseudoValidPayload)).toEqual(true);
  });
  it('should true when valid payload', () => {
    expect(isSyncPayload(validPayload)).toEqual(true);
  });
});

describe('parseSyncPayload', () => {
  it('should throw error when random arguments', async () => {
    await expect(parseSyncPayload('10101010', '01010')).rejects.toThrowError('Payload is not Temple Sync payload');
  });
  it('should throw error when only prefix', async () => {
    await expect(parseSyncPayload(prefixB64, validPassword)).rejects.toThrowError(FAILED_TO_DECRYPT_ERROR);
  });
  it('should throw error when pseudo valid payload', async () => {
    await expect(parseSyncPayload(pseudoValidPayload, validPassword)).rejects.toThrowError(FAILED_TO_DECRYPT_ERROR);
  });
  it('should throw error when valid payload and invalid password', async () => {
    await expect(parseSyncPayload(pseudoValidPayload, '01010')).rejects.toThrowError(FAILED_TO_DECRYPT_ERROR);
  });
  it('should parse when payload and password valid', async () => {
    mockReactNativeThemis.secureCellSealWithPassphraseDecrypt64.mockResolvedValueOnce(
      JSON.stringify([validParsed.mnemonic, validParsed.hdAccountsLength])
    );

    await expect(parseSyncPayload(validPayload, validPassword)).resolves.toEqual(validParsed);
  });
});
