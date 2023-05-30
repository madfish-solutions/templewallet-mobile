import { optimalApi } from '../../api.service';

export const optimalFetchEnableAds = async (address: string) => {
  try {
    await optimalApi.get(
      `/api/v1/decision/?publisher=templewallet&ad_types=tw-fullview&div_ids=ad&&wallets=1729%3A${address}`
    );
  } catch (err) {
    console.log('Failed to fetch optimal promotion api.');
  }
};
