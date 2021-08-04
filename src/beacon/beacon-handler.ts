import {
  BeaconMessageType,
  BeaconErrorType,
  BeaconRequestOutputMessage,
  P2PPairingRequest,
  BeaconResponseInputMessage
} from '@airgap/beacon-sdk';
import { ExtendedPeerInfo, PeerInfo } from '@airgap/beacon-sdk/dist/cjs/types/PeerInfo';
import * as sodium from 'libsodium-wrappers';

import { EventFn } from '../config/general';
import { isDefined } from '../utils/is-defined';
import { BeaconStorage } from './storage';
import { WalletClient } from './wallet-client';

export class BeaconHandler {
  private static _walletClient: WalletClient | undefined;

  static async init(onBeaconRequest: EventFn<BeaconRequestOutputMessage>) {
    await sodium.ready;

    if (!isDefined(BeaconHandler._walletClient)) {
      BeaconHandler._walletClient = new WalletClient({
        name: 'Temple Wallet',
        iconUrl: 'https://templewallet.com/logo.png',
        appUrl: 'https://templewallet.com',
        storage: new BeaconStorage()
      });
    }

    await BeaconHandler._walletClient.init();
    console.log('middle');
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
      await BeaconHandler._walletClient.isConnected;
      await BeaconHandler._walletClient.addPeer(peer, sendPairingResponse);
    }
  };

  public static respond = (message: BeaconResponseInputMessage) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient?.respond(message);
    }

    throw new Error('Wallet client not defined!');
  };

  public static getPermissions = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.getPermissions();
    }

    throw new Error('Wallet client not defined!');
  };

  public static getPeers = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.getPeers();
    }

    throw new Error('Wallet client not defined!');
  };

  public static removePermission = (accountIdentifier: string) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removePermission(accountIdentifier);
    }

    throw new Error('Wallet client not defined!');
  };

  public static removeAllPermissions = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removeAllPermissions();
    }
  };

  public static removePeer = (peer: ExtendedPeerInfo) => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removePeer(peer, true);
    }

    throw new Error('Wallet client not defined!');
  };

  public static removeAllPeers = () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return BeaconHandler._walletClient.removeAllPeers(true);
    }

    throw new Error('Wallet client not defined!');
  };

  public static isBeaconConnectedHandler = async () => {
    if (isDefined(BeaconHandler._walletClient)) {
      return await BeaconHandler._walletClient.isConnected;
    }

    throw new Error('Wallet client not defined!');
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
