import { PermissionRequestOutput } from '@airgap/beacon-sdk';

export interface ApprovePermissionRequestActionPayloadInterface {
  message: PermissionRequestOutput;
  publicKey: string;
}
