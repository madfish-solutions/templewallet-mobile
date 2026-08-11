import { PermissionInfo } from '@airgap/beacon-sdk';
import { SessionTypes } from '@walletconnect/types';

import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { BeaconDAppConnection, WalletConnectDAppConnection } from 'src/interfaces/dapp-connection.interface';
import { EvmChainSpecs } from 'src/types/networks';
import { getEvmNetworkLabel } from 'src/utils/evm/caip.utils';

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
  const chains = [
    ...new Set(
      namespaceValues.flatMap(namespace => {
        if (namespace.chains && namespace.chains.length > 0) {
          return namespace.chains;
        }

        return namespace.accounts.map(account => account.split(':').slice(0, 2).join(':'));
      })
    )
  ];

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
