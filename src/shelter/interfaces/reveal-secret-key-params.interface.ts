export interface RevealSecretKeyParams {
  publicKeyHash: string;
  successCallback: SyncFn<string>;
}
