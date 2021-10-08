import { PermissionRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';

export interface ApprovePermissionRequestActionPayloadInterface {
  message: PermissionRequestOutput;
  publicKey: string;
}
