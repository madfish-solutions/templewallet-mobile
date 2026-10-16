import { SessionTypes } from '@walletconnect/types';

import { partitionUniqueWcSessions } from './connection.utils';

const ADDRESS = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';

const createSession = ({
  topic,
  expiry,
  url = 'https://example-dapp.com',
  account = ADDRESS
}: {
  topic: string;
  expiry: number;
  url?: string;
  account?: string;
}): SessionTypes.Struct =>
  ({
    topic,
    pairingTopic: `pairing-${topic}`,
    expiry,
    acknowledged: true,
    controller: 'controller',
    namespaces: {
      eip155: {
        accounts: [`eip155:42793:${account}`],
        methods: [],
        events: []
      }
    },
    requiredNamespaces: {},
    optionalNamespaces: {},
    relay: { protocol: 'irn' },
    self: { publicKey: 'self', metadata: { name: 'Temple', description: '', url: '', icons: [] } },
    peer: {
      publicKey: `peer-${topic}`,
      metadata: { name: 'Example DApp', description: '', url, icons: [] }
    }
  } as SessionTypes.Struct);

describe('partitionUniqueWcSessions', () => {
  it('keeps the newest session per dApp origin and account', () => {
    const older = createSession({ topic: 'old', expiry: 100 });
    const newer = createSession({ topic: 'new', expiry: 200 });
    const otherDapp = createSession({ topic: 'other', expiry: 150, url: 'https://other-dapp.com' });

    const { kept, stale } = partitionUniqueWcSessions([older, newer, otherDapp]);

    expect(kept.map(session => session.topic).sort()).toEqual(['new', 'other']);
    expect(stale.map(session => session.topic)).toEqual(['old']);
  });

  it('treats different accounts for the same origin as distinct connections', () => {
    const firstAccount = createSession({ topic: 'a', expiry: 100, account: ADDRESS });
    const secondAccount = createSession({
      topic: 'b',
      expiry: 100,
      account: '0x0000000000000000000000000000000000000001'
    });

    const { kept, stale } = partitionUniqueWcSessions([firstAccount, secondAccount]);

    expect(kept).toHaveLength(2);
    expect(stale).toHaveLength(0);
  });
});
