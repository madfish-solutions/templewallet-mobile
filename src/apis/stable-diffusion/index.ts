import axios, { AxiosError } from 'axios';

import { CreateNftFormValues } from 'src/screens/text-to-nft/generate-art/tabs/create/create.form';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';

import { OrderCreationParams, SignInParams, SignInResponse, StableDiffusionOrder } from './types';

const stableDiffusionApi = axios.create({
  baseURL: 'https://stable-diffusion-nft-backend.stage.madfish.xyz/api/v1'
});

export const getStableDiffusionAccessToken = async (params: SignInParams) =>
  stableDiffusionApi
    .post<SignInResponse>('/signin', {
      ...params
    })
    .then(({ data }) => data.accessToken);

export const createStableDiffusionOrder = async (accessToken: string, formValues: CreateNftFormValues) => {
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
        headers: getRequestHeaders(accessToken)
      }
    )
    .then(({ data }) => data);
};

export const getStableDiffusionOrders = async (accessToken: string | null) =>
  isDefined(accessToken)
    ? stableDiffusionApi
        .get<StableDiffusionOrder[]>('/orders', {
          headers: getRequestHeaders(accessToken)
        })
        .then(({ data }) => data)
    : [];

export const getStableDiffusionOrderById = async (accessToken: string, id: string) =>
  stableDiffusionApi.get<StableDiffusionOrder>(`/orders/${id}`, {
    headers: getRequestHeaders(accessToken)
  });

export const getStableDiffusionUserQuota = async (accessToken: string) =>
  stableDiffusionApi
    .get<number>('/quota', {
      headers: getRequestHeaders(accessToken)
    })
    .then(({ data }) => data);

const getRequestHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`
});

export const handleStableDiffusionError = (e: any) => {
  let description: string, contentToCopy: string;
  description = contentToCopy = getAxiosQueryErrorMessage(e);

  if (e instanceof AxiosError) {
    const responseStatus = e.response?.status;
    const responseData = e.response?.data;
    const responseMessage = responseData?.message ?? responseData?.error;
    if (responseStatus === 500) {
      contentToCopy = responseMessage;
    } else if (isDefined(responseStatus) && responseStatus >= 400 && responseStatus <= 499) {
      description = responseMessage;
      contentToCopy = responseMessage;
    }
  }
  showErrorToast({
    description,
    isCopyButtonVisible: true,
    onPress: () => copyStringToClipboard(contentToCopy)
  });
};
