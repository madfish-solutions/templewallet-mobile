import { Alert } from 'react-native';

export const marketCapAlert = () =>
  Alert.alert(
    'Market Cap',
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
export const volumeAlert = () =>
  Alert.alert('Volume (24H)', 'A measure of how much of a cryptocurrency was traded in the last 24 hours.', [
    {
      text: 'Ok',
      style: 'default'
    }
  ]);
export const circulatingSupplyAlert = () =>
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
