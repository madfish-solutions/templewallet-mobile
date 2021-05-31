import { EventFn } from '../../config/general';

export interface RevealSecretKeyParams {
  publicKeyHash: string;
  successCallback: EventFn<string>;
}
