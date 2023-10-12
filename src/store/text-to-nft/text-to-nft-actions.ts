import { createAction } from '@reduxjs/toolkit';

import { StableDiffusionOrder } from 'src/apis/stable-diffusion/types';

import { createActions } from '../create-actions';

export const setIsHistoryBackButtonAlertShowedOnceAction = createAction<boolean>(
  'textToNft/SET_IS_HISTORY_BACK_BUTTON_ALERT_SHOWED_ONCE'
);

export const loadTextToNftOrdersActions = createActions<
  string,
  { accountPkh: string; orders: StableDiffusionOrder[] },
  { accountPkh: string; error: string }
>('textToNft/LOAD_TEXT_TO_NFT_ORDERS');

export const setAccessTokenAction = createAction<{ accountPkh: string; accessToken: string }>(
  'textToNft/SET_ACCESS_TOKEN'
);
