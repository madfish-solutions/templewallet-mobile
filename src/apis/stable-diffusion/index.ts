import axios from 'axios';

import { SignInParams, SignInResponse } from './types';

export const stableDiffusionApi = axios.create({
  baseURL: 'https://stable-diffusion-nft-backend.stage.madfish.xyz/api/v1'
});

export const fetchStableDiffusionSignIn = (params: SignInParams) =>
  stableDiffusionApi
    .post<SignInResponse>('/signin', {
      ...params
    })
    .then(({ data }) => data.accessToken)
    .catch(err => {
      console.error('Stable Diffusion SignIn:', err);

      return '';
    });
