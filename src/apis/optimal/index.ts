import { optimalApi } from '../../api.service';

export const optimalFetchEnableAds = async (address: string) => {
  const url = '/api/v1/decision/';

  const params = {
    publisher: 'templewallet',
    ad_types: 'tw-fullview',
    div_ids: 'ad',
    wallets: '1729'
  };

  try {
    await optimalApi.get(url, { params: { ...params, wallets: `${params.wallets}:${address}` } });
  } catch (err) {
    console.log('Failed to fetch optimal promotion api.');
  }
};
