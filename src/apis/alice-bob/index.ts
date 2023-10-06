import { templeWalletApi } from 'src/api.service';

import { AliceBobOrderInfoInterface, OutputEstimationResponse, PairsInfoResponse } from './types';

export const getAliceBobPairsInfo = async () => {
  const { data } = await templeWalletApi.get<PairsInfoResponse>('/alice-bob/get-pairs-info', {
    params: {
      isWithdraw: false
    }
  });

  return data;
};

export const estimateAliceBobOutput = async (amount: string, inputAssetCode: string, outputAssetCode: string) => {
  const { data } = await templeWalletApi.post<OutputEstimationResponse>('/alice-bob/estimate-amount', null, {
    params: {
      amount,
      from: getFromToParam(inputAssetCode),
      to: getFromToParam(outputAssetCode)
    }
  });

  return data.outputAmount;
};

export const createOrder = async (
  amount: string,
  inputAssetCode: string,
  outputAssetCode: string,
  userId: string,
  walletAddress?: string,
  cardNumber?: string
) => {
  const { data } = await templeWalletApi.post<{ orderInfo: AliceBobOrderInfoInterface }>(
    '/alice-bob/create-order',
    null,
    {
      params: {
        amount,
        from: getFromToParam(inputAssetCode),
        to: getFromToParam(outputAssetCode),
        userId,
        walletAddress,
        cardNumber
      }
    }
  );

  return data.orderInfo;
};

const getFromToParam = (code: string) => (code === 'XTZ' ? 'TEZ' : `CARD${code}`);
