import { createEntity } from '../create-entity';
import { TextToNftState } from './text-to-nft-state';

export const mockTextToNftState: TextToNftState = {
  accessToken: null,
  orders: createEntity([]),
  isHistoryBackButtonAlertShowedOnce: false
};
