import { useUsdToTokenRates } from '../../../../store/currency/currency-selectors';
import { useColors } from '../../../../styles/use-colors';
import { getPriceChangeColor, getValueToShow, getPriceChange } from '../../../../utils/market.util';
import { MarketCoin } from '../../../../store/market/market.interfaces';

export const useRowService = (item: MarketCoin) => {
  const { tez: tezosExchangeRate } = useUsdToTokenRates();
  const colors = useColors();

  const priceChangeColor = getPriceChangeColor(item.priceChange24h, colors);
  const { value: price, valueEstimatedInTezos: priceEstimatedInTezos } = getValueToShow(item.price, tezosExchangeRate);
  const { value: volume, valueEstimatedInTezos: volumeEstimatedInTezos } = getValueToShow(
    item.volume24h,
    tezosExchangeRate
  );
  const priceChange24h = getPriceChange(item.priceChange24h);

  return {
    price,
    priceEstimatedInTezos,
    volume,
    volumeEstimatedInTezos,
    priceChangeColor,
    priceChange24h
  };
};
