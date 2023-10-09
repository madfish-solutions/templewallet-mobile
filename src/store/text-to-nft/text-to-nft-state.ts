import { StableDiffusionOrder } from 'src/apis/stable-diffusion/types';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TextToNftState {
  accessToken: string | null;
  orders: LoadableEntityState<StableDiffusionOrder[]>;
  isHistoryBackButtonAlertShowedOnce: boolean;
}

export const textToNftInitialState: TextToNftState = {
  accessToken: null,
  orders: createEntity([]),
  isHistoryBackButtonAlertShowedOnce: false
};
