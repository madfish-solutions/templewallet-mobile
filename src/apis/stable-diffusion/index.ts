import axios from 'axios';

import { HISTORY_MOCK_DATA } from 'src/screens/text-to-nft/generate-art/tabs/history/mock-data';

import { GenerateArtParams, GenerateArtResponse, SignInParams, SignInResponse } from './types';

const stableDiffusionApi = axios.create({
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

// TODO: Add correct end-point
export const fetchStableDiffusionGenerateArt = (params: GenerateArtParams) =>
  stableDiffusionApi
    .post<GenerateArtResponse>('/generate-art', {
      ...params
    })
    .then(({ data }) => data.order)
    .catch(err => {
      console.error('Stable Diffusion Generate Art:', err);

      return HISTORY_MOCK_DATA[1];
    });
