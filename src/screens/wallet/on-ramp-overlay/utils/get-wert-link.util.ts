const WERT_ONRAMP_URL = 'https://onramp.templewallet.com';

export const getWertLink = async (address: string, amount = 0) => {
  const url = new URL(WERT_ONRAMP_URL);

  url.searchParams.set('commodity', 'XTZ');
  url.searchParams.set('network', 'tezos');
  url.searchParams.set('address', address);
  if (amount) url.searchParams.set('amount', String(amount));

  return url.toString();
};
