import axios from 'axios';

import { quipuswapStakingBaseUrls } from './consts';
import { FarmsListResponse, NetworkEnum, SingleFarmResponse } from './types';

const apis = {
  [NetworkEnum.Mainnet]: axios.create({ baseURL: quipuswapStakingBaseUrls[NetworkEnum.Mainnet] }),
  [NetworkEnum.Ghostnet]: axios.create({ baseURL: quipuswapStakingBaseUrls[NetworkEnum.Ghostnet] })
};

export const getSingleV3Farm = async (network: NetworkEnum, id: string) => {
  const response = await apis[network].get<SingleFarmResponse>(`/v3/multi-v2/${id}`);

  return response.data;
};

export const getV3FarmsList = async (network: NetworkEnum) => {
  const response = await apis[network].get<FarmsListResponse>('/v3/multi-v2');

  return response.data.list;
};
