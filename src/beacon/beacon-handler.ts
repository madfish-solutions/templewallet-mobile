import {
  BeaconMessageType,
  BeaconErrorType,
  BeaconRequestOutputMessage,
  P2PPairingRequest,
  BeaconResponseInputMessage,
  PeerInfo,
  WalletClient
} from '@airgap/beacon-sdk';
import type { ExtendedP2PPairingResponse } from '@airgap/beacon-types';

import { EventFn } from '../config/general';
import { isDefined } from '../utils/is-defined';

import { BeaconStorage } from './storage';

const WALLET_CLIENT_ERROR = 'Wallet client not defined!';

export class BeaconHandler {
  private static _walletClient: WalletClient | undefined;

  static async init(onBeaconRequest: EventFn<BeaconRequestOutputMessage>) {
    if (!isDefined(BeaconHandler._walletClient)) {
      BeaconHandler._walletClient = new WalletClient({
        name: 'Temple Wallet',
        iconUrl: 'https://templewallet.com/logo.png',
        appUrl: 'https://templewallet.com',
        storage: new BeaconStorage()
      });
    }

    await BeaconHandler._walletClient.init();
    await BeaconHandler._walletClient.connect(async message => {
      if (await isNetworkSupported(message)) {
        return onBeaconRequest(message);
      } else {
        return BeaconHandler.respond({
          type: BeaconMessageType.Error,
          id: message.id,
          errorType: BeaconErrorType.NETWORK_NOT_SUPPORTED
        });
      }
    });
  }

  public static addPeer = async (peer: PeerInfo, sendPairingResponse?: boolean) => {
    if (isDefined(BeaconHandler._walletClient)) {
      const isConnected = await BeaconHandler._walletClient.isConnected;
      isConnected && (await BeaconHandler._walletClient.addPeer(peer, sendPairingResponse));
    }
  };

  public static respond = (message: BeaconResponseInputMessage) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient?.respond(message);
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };

  public static getPermissions = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.getPermissions();
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };

  public static getPeers = () => {
    if (BeaconHandler._walletClient) {
      return BeaconHandler._walletClient.getPeers() as Promise<P2PPairingRequest[]>;
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };

  public static removePermission = (accountIdentifier: string, senderId: string) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removePermission(accountIdentifier, senderId);
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };

  public static removeAllPermissions = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removeAllPermissions();
    }
  };

  public static removePeer = (peer: ExtendedP2PPairingResponse) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removePeer(peer, true);
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };

  public static removeAllPeers = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removeAllPeers(true);
    }

    return Promise.reject(WALLET_CLIENT_ERROR);
  };
}

async function isNetworkSupported(_message: BeaconRequestOutputMessage) {
  return true;
}

export const isBeaconMessage: (obj: unknown) => obj is P2PPairingRequest = (obj: unknown): obj is P2PPairingRequest => {
  return (
    typeof (obj as P2PPairingRequest).name === 'string' &&
    typeof (obj as P2PPairingRequest).publicKey === 'string' &&
    typeof (obj as P2PPairingRequest).relayServer === 'string'
    // version is not checked to be v1 compatible
  );
};
