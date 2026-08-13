import { PermissionRequestOutput } from '@tezos-x/octez.connect-sdk';

export interface ApprovePermissionRequestActionPayloadInterface {
  message: PermissionRequestOutput;
  publicKey: string;
}
