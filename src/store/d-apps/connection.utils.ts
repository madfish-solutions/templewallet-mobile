import { PermissionInfo } from '@airgap/beacon-sdk';
import { SessionTypes } from '@walletconnect/types';

import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { BeaconDAppConnection, WalletConnectDAppConnection } from 'src/interfaces/dapp-connection.interface';
import { EvmChainSpecs } from 'src/types/networks';
import { getEvmNetworkLabel } from 'src/utils/evm/caip.utils';
import { isDefined } from 'src/utils/is-defined';

export const mapBeaconPermissionToConnection = (permission: PermissionInfo): BeaconDAppConnection => ({
  id: `beacon:${permission.accountIdentifier}:${permission.senderId}`,
  protocol: DAppConnectionProtocol.Beacon,
  name: permission.appMetadata.name,
  iconUri: permission.appMetadata.icon,
  iconSeed: permission.appMetadata.senderId,
  networkLabel: permission.network.type,
  accountAddress: permission.address || permission.publicKey,
  accountIdentifier: permission.accountIdentifier,
  senderId: permission.senderId
});

export const mapWcSessionToConnection = (
  session: SessionTypes.Struct,
  evmChainsSpecs: EvmChainSpecs[]
): WalletConnectDAppConnection => {
  const namespaceValues = Object.values(session.namespaces);
  const accounts = namespaceValues.flatMap(namespace => namespace.accounts);
  const chains = Array.from(
    new Set(
      namespaceValues.flatMap(namespace => {
        if (namespace.chains && namespace.chains.length > 0) {
          return namespace.chains;
        }

        return namespace.accounts.map(account => account.split(':').slice(0, 2).join(':'));
      })
    )
  );

  return {
    id: `wc:${session.topic}`,
    protocol: DAppConnectionProtocol.WalletConnect,
    name: session.peer.metadata.name,
    iconUri: session.peer.metadata.icons?.[0],
    iconSeed: session.peer.metadata.url || session.peer.metadata.name,
    networkLabel: chains.map(caipChainId => getEvmNetworkLabel(caipChainId, evmChainsSpecs)).join(', ') || 'Unknown',
    accountAddress: accounts[0]?.split(':')[2],
    topic: session.topic
  };
};

const normalizeWcDappOrigin = (origin: string) => origin.trim().toLowerCase().replace(/\/+$/, '');

/**
 * Stable identity for a WC dApp connection: peer origin (url, else name) + connected account.
 * Topics/session ids are intentionally excluded so reconnects to the same dApp can be de-duplicated.
 */
export const getWcDappIdentityKey = (origin: string, accountAddress?: string) =>
  `${normalizeWcDappOrigin(origin)}|${accountAddress?.toLowerCase() ?? ''}`;

export const getWcPeerOrigin = (metadata: { url?: string; name?: string }) => metadata.url || metadata.name || '';

const getWcSessionAccountAddress = (session: SessionTypes.Struct) =>
  Object.values(session.namespaces)
    .flatMap(namespace => namespace.accounts)
    .map(account => account.split(':')[2])
    .find(isDefined);

export const getWcSessionDappIdentityKey = (session: SessionTypes.Struct) =>
  getWcDappIdentityKey(getWcPeerOrigin(session.peer.metadata), getWcSessionAccountAddress(session));

/**
 * Keeps the newest session (highest expiry) per dApp identity; returns older duplicates as stale.
 */
export const partitionUniqueWcSessions = (sessions: SessionTypes.Struct[]) => {
  const keptByIdentity = new Map<string, SessionTypes.Struct>();

  for (const session of sessions) {
    const identityKey = getWcSessionDappIdentityKey(session);
    const existing = keptByIdentity.get(identityKey);

    if (!isDefined(existing) || session.expiry > existing.expiry) {
      keptByIdentity.set(identityKey, session);
    }
  }

  const kept = Array.from(keptByIdentity.values());
  const keptTopics = new Set(kept.map(session => session.topic));
  const stale = sessions.filter(session => !keptTopics.has(session.topic));

  return { kept, stale };
};
