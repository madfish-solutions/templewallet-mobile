import { templeWalletApi } from 'src/api.service';

export const getTezUahPairInfo = async () => {
  const { data } = await templeWalletApi.get<{ minAmount: number; maxAmount: number }>('/alice-bob/get-pair-info');

  return data;
};

export const getTezUahPairEstimation = async (uahAmount: number) => {
  const { data } = await templeWalletApi.post<{ outputAmount: number }>('/alice-bob/estimate-amount', {
    params: {
      amount: uahAmount
    }
  });

  return data.outputAmount;
};
