import { Alert } from 'react-native';

import { useTezosMarketToken } from '../../../store/market/market-selectors';
import { useColors } from '../../../styles/use-colors';
import { getPriceChangeColor, getValueToShow, getPriceChange } from '../../../utils/market.util';

export const useTezosInfoService = () => {
  const marketTezos = useTezosMarketToken();
  const colors = useColors();

  const priceChange24hColor = getPriceChangeColor(marketTezos?.priceChange24h, colors);
  const priceChange7dColor = getPriceChangeColor(marketTezos?.priceChange7d, colors);

  const { value: price } = getValueToShow(marketTezos?.price);
  const { value: supply } = getValueToShow(marketTezos?.supply);
  const { value: marketCup } = getValueToShow(marketTezos?.marketCup);
  const { value: volume24h } = getValueToShow(marketTezos?.volume24h);
  const priceChange7d = getPriceChange(marketTezos?.priceChange7d);
  const priceChange24h = getPriceChange(marketTezos?.priceChange24h);

  const marketCupAlert = () =>
    Alert.alert(
      'Market Cup',
      `The total market value of a cryptocurrency's circulating supply. It is analogous to the free-float capitalization in the stock market.

    Market Cap = Current Price x Circulating Supply.
    `,
      [
        {
          text: 'Ok',
          style: 'default'
        }
      ]
    );
  const volumeAlert = () =>
    Alert.alert('Valume (24H)', 'A measure of how much of a cryptocurrency was traded in the last 24 hours.', [
      {
        text: 'Ok',
        style: 'default'
      }
    ]);
  const circulatingSupplyAlert = () =>
    Alert.alert(
      'Circulating Supply',
      'The amount of coins that are circulating in the market and are in public hands. It is analogous to the flowing shares in the stock market.',
      [
        {
          text: 'Ok',
          style: 'default'
        }
      ]
    );

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
    name: marketTezos?.name,
    marketCupAlert,
    volumeAlert,
    circulatingSupplyAlert
  };
};
