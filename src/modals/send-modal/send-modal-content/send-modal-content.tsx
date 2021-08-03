import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { AccountFormDropdown } from '../../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ModalStatusBar } from '../../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { tileMargin } from '../../../components/segmented-control/segmented-control.styles';
import { TokenFormDropdown } from '../../../components/token-dropdown/token-form-dropdown';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormNumericInput } from '../../../form/form-numeric-input/form-numeric-input';
import { FormTextSegmentControl } from '../../../form/form-text-segment-control';
import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { useTokenExchangeRate } from '../../../hooks/use-token-exchange-rate.hook';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { showWarningToast } from '../../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { isDefined } from '../../../utils/is-defined';
import { isString } from '../../../utils/is-string';
import { SendModalFormValues } from '../send-modal.form';
import { useSendModalContentStyles } from './send-modal-content.styles';

// TODO: load real fee instead
const TEZ_MAX_FEE = 0.1;

interface Props extends Pick<FormikProps<SendModalFormValues>, 'values' | 'setFieldValue' | 'submitForm'> {
  ownAccountsReceivers: WalletAccountInterface[];
  tokensList: TokenInterface[];
  initialAssetSymbol: string;
}

const ESTIMATED_SWITCHER_CHAR_WIDTH = 11.6;
const DEFAULT_USD_LABEL_WIDTH = 33.6;

export const SendModalContent: FC<Props> = ({
  initialAssetSymbol,
  values,
  setFieldValue,
  submitForm,
  tokensList,
  ownAccountsReceivers
}) => {
  const { amountUnitIndex, token } = values;
  const { goBack } = useNavigation();
  const styles = useSendModalContentStyles();
  const prevAmountUnitIndexRef = useRef(amountUnitIndex);
  const tokenExchangeRate = useTokenExchangeRate(token);

  const calculationTokenSymbol = isString(values.token.symbol) ? values.token.symbol : initialAssetSymbol;
  const { layoutWidth: tokenTextWidth, handleLayout: handleTokenTextLayout } = useLayoutSizes(
    calculationTokenSymbol.length * ESTIMATED_SWITCHER_CHAR_WIDTH
  );
  const { layoutWidth: usdTextWidth, handleLayout: handleUsdTextLayout } = useLayoutSizes(DEFAULT_USD_LABEL_WIDTH);
  const maxSwitcherOptionWidth = Math.max(tokenTextWidth, usdTextWidth);

  const switcherWidth = (maxSwitcherOptionWidth + formatSize(16) + tileMargin) * 2;

  useEffect(() => {
    setFieldValue('amountUnitIndex', 0);
    setFieldValue('amount', undefined);
  }, [token]);
  useEffect(() => {
    const oldAmount = values.amount;
    const prevAmountUnitIndex = prevAmountUnitIndexRef.current;
    if (!isDefined(oldAmount) || !isDefined(tokenExchangeRate)) {
      prevAmountUnitIndexRef.current = amountUnitIndex;

      return;
    }
    if (prevAmountUnitIndex === 1 && amountUnitIndex === 0) {
      setFieldValue('amount', oldAmount.div(tokenExchangeRate).decimalPlaces(token.decimals, BigNumber.ROUND_FLOOR));
    } else if (prevAmountUnitIndex === 0 && amountUnitIndex === 1) {
      setFieldValue('amount', oldAmount.times(tokenExchangeRate).decimalPlaces(2, BigNumber.ROUND_FLOOR));
    }
    prevAmountUnitIndexRef.current = amountUnitIndex;
  }, [values.amount, amountUnitIndex, token, tokenExchangeRate, setFieldValue]);

  const amountMaxValue = useMemo(() => {
    const maxTokens = BigNumber.max(
      new BigNumber(token.balance).minus(token.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_MAX_FEE : 0),
      0
    );
    if (amountUnitIndex === 0 || !isDefined(tokenExchangeRate)) {
      return maxTokens;
    }

    return maxTokens.times(tokenExchangeRate).decimalPlaces(2, BigNumber.ROUND_FLOOR);
  }, [token, amountUnitIndex, tokenExchangeRate]);

  const transferBetweenOwnAccountsDisabled = ownAccountsReceivers.length === 0;

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />
      <View>
        <Label label="Asset" description="Select asset or token." />
        <TokenFormDropdown name="token" list={tokensList} />
        <Divider />

        <Label label="To" description={`Address or Tezos domain to send ${token.symbol} funds to.`} />
        {values.transferBetweenOwnAccounts ? (
          <AccountFormDropdown name="ownAccount" list={ownAccountsReceivers} />
        ) : (
          <FormAddressInput name="receiverPublicKeyHash" placeholder="e.g. address" />
        )}
        <View
          onTouchStart={() =>
            void (transferBetweenOwnAccountsDisabled && showWarningToast({ description: 'Create one more account' }))
          }>
          <FormCheckbox
            disabled={transferBetweenOwnAccountsDisabled}
            name="transferBetweenOwnAccounts"
            size={formatSize(16)}>
            <Text style={styles.checkboxText}>Transfer between my accounts</Text>
          </FormCheckbox>
        </View>
        <Divider size={formatSize(12)} />

        <View style={styles.measurementTextsContainer}>
          <Text style={styles.switcherOptionText} accessibilityLabel="" onLayout={handleTokenTextLayout}>
            {token.symbol}
          </Text>
          <Text style={styles.switcherOptionText} accessibilityLabel="" onLayout={handleUsdTextLayout}>
            USD
          </Text>
        </View>

        <View style={styles.amountInputHeading}>
          <Label label="Amount" description={`Set ${token.symbol} amount to send.`} />
          {isDefined(tokenExchangeRate) && tokenExchangeRate > 0 && (
            <View>
              <FormTextSegmentControl name="amountUnitIndex" values={[token.symbol, 'USD']} width={switcherWidth} />
              <Divider size={formatSize(8)} />
            </View>
          )}
        </View>

        <FormNumericInput
          name="amount"
          maxValue={amountMaxValue}
          decimals={amountUnitIndex === 0 ? token.decimals : 2}
          placeholder="0.00">
          {value =>
            isDefined(value) && isDefined(tokenExchangeRate) ? (
              <Text style={styles.subtitle}>
                {amountUnitIndex === 0
                  ? `≈ ${value.times(tokenExchangeRate).toFormat(2, BigNumber.ROUND_FLOOR)} $`
                  : `≈ ${value
                      .div(tokenExchangeRate)
                      .decimalPlaces(token.decimals, BigNumber.ROUND_FLOOR)
                      .toString()} ${token.symbol}`}
              </Text>
            ) : null
          }
        </FormNumericInput>
        <Divider />
      </View>

      <View>
        <ButtonsContainer>
          <ButtonLargeSecondary title="Close" onPress={goBack} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary title="Send" onPress={submitForm} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
