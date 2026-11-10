import { P2PCommunicationClient, PendingPairingRequests, getHexHash } from '@ecadlabs/beacon-sdk';

import { BeaconStorage } from './storage';

describe('Beacon pairing authorization', () => {
  it('ignores a pairing response without an active request', async () => {
    const requests = new PendingPairingRequests();
    const acceptPeer = jest.fn();

    await requests.accept('unsolicited', acceptPeer);

    expect(acceptPeer).not.toHaveBeenCalled();
  });

  it('accepts an active request once', async () => {
    const requests = new PendingPairingRequests();
    const acceptPeer = jest.fn();
    requests.add('requested');

    await requests.accept('requested', acceptPeer);
    await requests.accept('requested', acceptPeer);

    expect(acceptPeer).toHaveBeenCalledTimes(1);
  });

  it('ignores a response after pairing cancellation', async () => {
    const requests = new PendingPairingRequests();
    const acceptPeer = jest.fn();
    requests.add('cancelled');

    await requests.cancel();
    await requests.accept('cancelled', acceptPeer);

    expect(acceptPeer).not.toHaveBeenCalled();
  });
});

describe('Beacon Matrix sender identity', () => {
  const publicKey = '01'.repeat(32);
  const client = new P2PCommunicationClient(
    'Temple Wallet',
    { publicKey: new Uint8Array(32), secretKey: new Uint8Array(64) },
    1,
    new BeaconStorage()
  );

  it.each([
    { suffix: '', accepted: true },
    { suffix: 'attacker', accepted: false }
  ])('requires the complete peer hash (suffix: "$suffix")', async ({ suffix, accepted }) => {
    const hash = await getHexHash(Buffer.from(publicKey, 'hex'));
    const event = {
      type: 'message',
      content: {
        roomId: '!room:relay.example',
        message: {
          type: 'm.text',
          sender: `@${hash}${suffix}:relay.example`,
          content: 'payload',
          timestamp: 0
        }
      }
    } as Parameters<P2PCommunicationClient['isSender']>[0];

    await expect(client.isSender(event, publicKey)).resolves.toBe(accepted);
  });
});
