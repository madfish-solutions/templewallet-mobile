export interface SignInParams {
  pk: string;
  timestamp: string;
  sig: string;
}
export interface SignInResponse {
  accessToken: string;
}

export type OrderPanoramaParam = 'yes' | 'no';

export interface OrderCreationParams {
  positivePrompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  panorama?: OrderPanoramaParam;
}

export enum OrderStatus {
  Pending = 'pending',
  Ready = 'ready',
  Failed = 'failed'
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
  panorama: OrderPanoramaParam;
}
