import { useSelector } from 'react-redux';

import { ExolixRootState, ExolixState } from './exolix-state';

export const useExolixStep = () => useSelector<ExolixRootState, number>(({ exolix }) => exolix.step);

export const useExolixExchangeData = () =>
  useSelector<ExolixRootState, ExolixState['exchangeData']>(({ exolix }) => exolix.exchangeData);

export const useExolixCurrencies = () =>
  useSelector<ExolixRootState, ExolixState['currencies']>(({ exolix }) => exolix.currencies);
