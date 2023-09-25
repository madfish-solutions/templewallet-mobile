export interface SignInParams {
  pk: string;
  timestamp: string;
  sig: string;
}
export interface SignInResponse {
  accessToken: string;
}

export interface GenerateArtParams {
  accessToken: string;
  positivePrompt: string;
  negativePrompt?: string;
  artStyle: string;
}
export interface GenerateArtResponse {
  order: StableDiffusionOrder;
}

export enum OrderStatus {
  Pending = 'pending',
  Ready = 'ready',
  Failed = 'failed'
}

type PanoramaUnionType = 'yes' | 'no';

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
  panorama: PanoramaUnionType;
}
