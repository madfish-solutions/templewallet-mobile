import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';

interface DAppConnectionBase {
  id: string;
  protocol: DAppConnectionProtocol;
  name: string;
  iconUri?: string;
  iconSeed: string;
  networkLabel: string;
  accountAddress?: string;
}

export interface BeaconDAppConnection extends DAppConnectionBase {
  protocol: DAppConnectionProtocol.Beacon;
  accountIdentifier: string;
  senderId: string;
}

export interface WalletConnectDAppConnection extends DAppConnectionBase {
  chains: string[];
  protocol: DAppConnectionProtocol.WalletConnect;
  topic: string;
}

export type DAppConnection = BeaconDAppConnection | WalletConnectDAppConnection;
