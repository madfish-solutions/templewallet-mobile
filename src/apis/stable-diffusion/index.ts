import axios from 'axios';

import { CreateNftFormValues } from 'src/screens/text-to-nft/generate-art/tabs/create/create.form';
import { isDefined } from 'src/utils/is-defined';

import { OrderCreationParams, SignInParams, SignInResponse, StableDiffusionOrder } from './types';

const stableDiffusionApi = axios.create({
  baseURL: 'https://stable-diffusion-nft-backend.stage.madfish.xyz/api/v1'
});

export const getStableDiffusionAccessToken = (params: SignInParams) =>
  stableDiffusionApi
    .post<SignInResponse>('/signin', {
      ...params
    })
    .then(({ data }) => data.accessToken);

export const createStableDiffusionOrder = (accessToken: string, formValues: CreateNftFormValues) => {
  const { positivePrompt, negativePrompt, artStyle } = formValues;

  const params: OrderCreationParams = {
    positivePrompt: isDefined(artStyle) ? `${artStyle} ${positivePrompt}` : positivePrompt,
    negativePrompt
  };

  return stableDiffusionApi
    .post<Pick<StableDiffusionOrder, 'id' | 'status'>>(
      '/orders',
      { ...params },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    .then(({ data }) => data);
};

export const getStableDiffusionOrders = (accessToken: string | null) =>
  isDefined(accessToken)
    ? stableDiffusionApi
        .get<StableDiffusionOrder[]>('/orders', {
          headers: getRequestHeaders(accessToken)
        })
        .then(({ data }) => data)
    : [];

export const getStableDiffusionOrderById = (accessToken: string, id: string) =>
  stableDiffusionApi.get<StableDiffusionOrder>(`/orders/${id}`, {
    headers: getRequestHeaders(accessToken)
  });

export const getStableDiffusionUserQuota = (accessToken: string) =>
  stableDiffusionApi.get<number>('/quota', {
    headers: getRequestHeaders(accessToken)
  });

const getRequestHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`
});
