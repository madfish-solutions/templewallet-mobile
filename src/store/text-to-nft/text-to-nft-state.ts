import { StableDiffusionOrder } from 'src/apis/stable-diffusion/types';

import { LoadableEntityState } from '../types';

interface TextToNftAccount {
  accessToken: string | null;
  orders: LoadableEntityState<StableDiffusionOrder[]>;
}

export interface TextToNftState {
  accountsStateRecord: Record<string, TextToNftAccount>;
  isHistoryBackButtonAlertShowedOnce: boolean;
}

export const textToNftInitialState: TextToNftState = {
  accountsStateRecord: {},
  isHistoryBackButtonAlertShowedOnce: false
};
