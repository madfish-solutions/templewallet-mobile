import { useTezosMarketCoin } from '../../../store/market/market-selectors';
import { useColors } from '../../../styles/use-colors';
import { getPriceChangeColor, getValueToShow, getPriceChange } from '../../../utils/market.util';

export const useTezosInfoService = () => {
  const marketTezos = useTezosMarketCoin();
  const colors = useColors();

  const priceChange24hColor = getPriceChangeColor(marketTezos?.priceChange24h, colors);
  const priceChange7dColor = getPriceChangeColor(marketTezos?.priceChange7d, colors);

  const { value: price } = getValueToShow(marketTezos?.price);
  const { value: supply } = getValueToShow(marketTezos?.supply);
  const { value: marketCup } = getValueToShow(marketTezos?.marketCup);
  const { value: volume24h } = getValueToShow(marketTezos?.volume24h);
  const priceChange7d = getPriceChange(marketTezos?.priceChange7d);
  const priceChange24h = getPriceChange(marketTezos?.priceChange24h);

  return {
    price,
    supply,
    volume24h,
    marketCup,
    priceChange7d,
    priceChange24h,
    priceChange7dColor,
    priceChange24hColor,
    imageUrl: marketTezos?.imageUrl,
    symbol: marketTezos?.symbol,
    name: marketTezos?.name
  };
};
