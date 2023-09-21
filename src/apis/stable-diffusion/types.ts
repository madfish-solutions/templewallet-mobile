export interface SignInParams {
  pk: string;
  timestamp: string;
  sig: string;
}

export interface SignInResponse {
  accessToken: string;
}

export enum OrderStatus {
  Pending = 'pending',
  Ready = 'ready',
  Failed = 'failed'
}

export enum PanoramaEnum {
  Yes = 'yes',
  No = 'no'
}

/**
 * @param id - uuid;
 * @param createdAt  - iso timestamp;
 * @param variants - array of uri;
 * */

export interface StableDiffusionOrder {
  id: string;
  createdAt: string;
  accountPkh: string;
  positivePrompt: string;
  negativePrompt: string;
  status: OrderStatus;
  variants: string[] | null;
  width: number;
  height: number;
  panorama: PanoramaEnum;
}
