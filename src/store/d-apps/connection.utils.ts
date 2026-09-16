import { Network, NetworkType, PermissionInfo } from '@airgap/beacon-sdk';
import { SessionTypes } from '@walletconnect/types';
import { capitalize } from 'lodash-es';
import { Address } from 'viem';

import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { Account } from 'src/interfaces/account.interfaces';
import {
  BeaconDAppConnection,
  DAppConnection,
  WalletConnectDAppConnection
} from 'src/interfaces/dapp-connection.interface';
import { EvmChainSpecs } from 'src/types/networks';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { getEvmNetworkLabel, parseEvmCaipAccountId, toEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { buildSafeURL } from 'src/utils/url.utils';
import { WC_SESSION_TTL_SECONDS } from 'src/walletconnect/constants';

const getBeaconNetworkLabel = (network: Network) => {
  switch (network.type) {
    case NetworkType.MAINNET:
      return 'Tezos';
    case NetworkType.CUSTOM:
      return network.name || 'Custom';
    default:
      return capitalize(network.type);
  }
};

export const mapBeaconPermissionToConnection = (permission: PermissionInfo): BeaconDAppConnection => ({
  id: `beacon:${permission.accountIdentifier}:${permission.senderId}`,
  protocol: DAppConnectionProtocol.Beacon,
  name: permission.appMetadata.name,
  iconUri: permission.appMetadata.icon,
  iconSeed: permission.appMetadata.senderId,
  networkLabel: getBeaconNetworkLabel(permission.network),
  accountAddress: permission.address || permission.publicKey,
  accountIdentifier: permission.accountIdentifier,
  senderId: permission.senderId,
  connectedAt: permission.connectedAt
});

export const isAccountConnection = (connection: DAppConnection, account: Account) => {
  if (!isDefined(connection.accountAddress)) {
    return false;
  }

  if (connection.protocol === DAppConnectionProtocol.Beacon) {
    return connection.accountAddress === getAccountAddressForTezos(account);
  }

  return connection.accountAddress.toLowerCase() === getAccountAddressForEvm(account)?.toLowerCase();
};

const getWcSessionConnectedAt = (session: SessionTypes.Struct) => (session.expiry - WC_SESSION_TTL_SECONDS) * 1000;

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

        return namespace.accounts.map(account => toEvmCaipChainId(parseEvmCaipAccountId(account)![0]));
      })
    )
  );

  let accountAddress: Address | undefined;
  if (accounts.length > 0) {
    const parseResult = parseEvmCaipAccountId(accounts[0]);
    accountAddress = parseResult?.[1];
  }

  return {
    id: `wc:${session.topic}`,
    chains,
    protocol: DAppConnectionProtocol.WalletConnect,
    name: session.peer.metadata.name,
    iconUri: getWcPeerIconUri(session.peer.metadata),
    iconSeed: session.peer.metadata.url || session.peer.metadata.name,
    networkLabel: chains.map(caipChainId => getEvmNetworkLabel(caipChainId, evmChainsSpecs)).join(', ') || 'Unknown',
    accountAddress,
    topic: session.topic,
    connectedAt: getWcSessionConnectedAt(session)
  };
};

export const sortConnectionsByNewest = (connections: DAppConnection[]) =>
  [...connections].sort((a, b) => b.connectedAt - a.connectedAt);

const normalizeWcDappOrigin = (origin: string) => origin.trim().toLowerCase().replace(/\/+$/, '');

/**
 * Stable identity for a WC dApp connection: peer origin (url, else name) + connected account.
 * Topics/session ids are intentionally excluded so reconnects to the same dApp can be de-duplicated.
 */
export const getWcDappIdentityKey = (origin: string, accountAddress?: string) =>
  `${normalizeWcDappOrigin(origin)}|${accountAddress?.toLowerCase() ?? ''}`;

export const getWcPeerOrigin = (metadata: { url?: string; name?: string }) => metadata.url || metadata.name || '';

const WC_ICON_PROTOCOLS = ['http:', 'https:'];

export const getWcPeerIconUri = (metadata: { url?: string; icons?: string[] }) => {
  const icon = metadata.icons?.find(isString);

  if (!isDefined(icon)) {
    return undefined;
  }

  const base = isString(metadata.url) ? buildSafeURL(metadata.url) : null;
  const url = isDefined(base) ? buildSafeURL(icon, base) : buildSafeURL(icon);

  return isDefined(url) && WC_ICON_PROTOCOLS.includes(url.protocol) ? url.href : undefined;
};

const getWcSessionAccountAddress = (session: SessionTypes.Struct) =>
  Object.values(session.namespaces)
    .flatMap(namespace => namespace.accounts)
    .map(account => parseEvmCaipAccountId(account)?.[1])
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
