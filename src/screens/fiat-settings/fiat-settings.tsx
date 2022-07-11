import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { setFiatCurrency } from '../../store/settings/settings-actions';
import { useFiatCurrencySelector } from '../../store/settings/settings-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { FiatCurrenciesEnum, FIAT_CURRENCIES } from '../../utils/exchange-rate.util';
import { useFiatSettingsStyles } from './fiat-settings.styles';

export const FiatSettings = () => {
  const dispatch = useDispatch();
  const selectedFiatCurrency = useFiatCurrencySelector();
  const styles = useFiatSettingsStyles();

  const radioButtons = useMemo(
    () =>
      FIAT_CURRENCIES.map(currency => ({
        label: `${currency.symbol}  ${currency.name} (${currency.fullname})`,
        value: currency.name
      })),
    []
  );

  usePageAnalytic(ScreensEnum.FiatSettings);
  const handleChange = (fiat: FiatCurrenciesEnum) => dispatch(setFiatCurrency(fiat));

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup
        labelStyle={styles.label}
        value={selectedFiatCurrency}
        buttons={radioButtons}
        onChange={handleChange}
      />
      <Divider />
    </ScreenContainer>
  );
};
