import { useSelector } from '../selector';

export const useExolixStep = () => useSelector(({ exolix }) => exolix.step);

export const useExolixExchangeData = () => useSelector(({ exolix }) => exolix.exchangeData);

export const useExolixCurrencies = () => useSelector(({ exolix }) => exolix.currencies);
