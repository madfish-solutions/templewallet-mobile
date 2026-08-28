import { CoreTypes, SessionTypes } from '@walletconnect/types';

import {
  getWcDappIdentityKey,
  getWcPeerOrigin,
  getWcSessionDappIdentityKey,
  partitionUniqueWcSessions
} from 'src/store/d-apps/connection.utils';

import { WcHandler } from './wc-handler';

const disconnectSessionsQuietly = async (sessions: SessionTypes.Struct[]) => {
  await Promise.allSettled(sessions.map(session => WcHandler.disconnectSession(session.topic)));
};

/**
 * Disconnects active WC sessions that match the same dApp origin + account (e.g. before approving a reconnect).
 */
export const disconnectDuplicateWcSessionsForPeer = async (
  peerMetadata: CoreTypes.Metadata,
  accountAddress: HexString
) => {
  const identityKey = getWcDappIdentityKey(getWcPeerOrigin(peerMetadata), accountAddress);
  const sessions = Object.values(WcHandler.getActiveSessions());
  const duplicates = sessions.filter(session => getWcSessionDappIdentityKey(session) === identityKey);

  await disconnectSessionsQuietly(duplicates);
};

/**
 * Keeps one session per dApp identity and disconnects older duplicates left behind by reconnects.
 */
export const cleanupDuplicateWcSessions = async (): Promise<SessionTypes.Struct[]> => {
  const sessions = Object.values(WcHandler.getActiveSessions());
  const { kept, stale } = partitionUniqueWcSessions(sessions);

  if (stale.length > 0) {
    await disconnectSessionsQuietly(stale);
  }

  return kept;
};
