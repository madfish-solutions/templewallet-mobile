import { PermissionRequestOutput } from '@ecadlabs/beacon-sdk';

export interface ApprovePermissionRequestActionPayloadInterface {
  message: PermissionRequestOutput;
  publicKey: string;
}
