import {
  BEACON_VERSION,
  WalletClient,
  Network,
  BeaconMessageType,
  BeaconErrorType,
  BeaconRequestOutputMessage,
  BeaconResponseInputMessage,
  getSenderId
} from '@airgap/beacon-sdk';

import { EventFn } from '../config/general';
import { BeaconStorage } from './storage';

type BeaconRequestEvent = {
  message: BeaconRequestOutputMessage;
};

export const walletClient = new WalletClient({
  name: 'Temple Wallet',
  iconUrl: 'https://templewallet.com/logo.png',
  appUrl: 'https://templewallet.com',
  storage: new BeaconStorage()
});

export async function initWalletClient(onBeaconRequest: EventFn<BeaconRequestEvent>) {
  await walletClient.init();
  await walletClient.connect(async message => {
    if (await isNetworkSupported((message as { network?: Network }).network)) {
      return onBeaconRequest({ message });
    } else {
      return sendNetworkNotSupportedError(message.id);
    }
  });
}

async function sendNetworkNotSupportedError(id: string) {
  const responseInput = {
    id,
    type: BeaconMessageType.Error,
    errorType: BeaconErrorType.NETWORK_NOT_SUPPORTED
  } as any; // TODO: Fix type

  const response: BeaconResponseInputMessage = {
    senderId: await getSenderId(await walletClient.beaconId), // TODO: Remove senderId and version from input message
    version: BEACON_VERSION,
    ...responseInput
  };
  await walletClient.respond(response);
  // await displayErrorPage(new Error('Network not supported!'))
}

async function isNetworkSupported(_network?: Network) {
  return true;
}
