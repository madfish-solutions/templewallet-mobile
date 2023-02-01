import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledRadioGroup } from 'src/components/styled-radio-buttons-group/styled-radio-buttons-group';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { setFiatCurrency } from 'src/store/settings/settings-actions';
import { useFiatCurrencySelector } from 'src/store/settings/settings-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { FiatCurrenciesEnum, FIAT_CURRENCIES } from 'src/utils/exchange-rate.util';

import { useFiatSettingsStyles } from './fiat-settings.styles';

export const FiatSettings = () => {
  const dispatch = useDispatch();
  const selectedFiatCurrency = useFiatCurrencySelector();
  const styles = useFiatSettingsStyles();

  const radioItems = useMemo(
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
      <StyledRadioGroup
        labelStyle={styles.label}
        value={selectedFiatCurrency}
        items={radioItems}
        onChange={handleChange}
      />
      <Divider />
    </ScreenContainer>
  );
};
