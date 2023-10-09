import { optimalApi } from 'src/api.service';

export const optimalFetchEnableAds = async (address: string) => {
  const url = '/api/v1/decision/';

  try {
    await optimalApi.get(url, {
      params: {
        publisher: 'templewallet',
        ad_types: 'tw-fullview',
        div_ids: 'ad',
        wallets: `1729:${address}`
      }
    });
  } catch (err) {
    console.log('Failed to fetch optimal promotion api.');
  }
};
