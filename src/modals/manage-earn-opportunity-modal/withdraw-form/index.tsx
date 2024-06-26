import { BigNumber } from 'bignumber.js';
import { FormikProvider, FormikProps } from 'formik';
import { noop } from 'lodash-es';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { AssetAmountInput } from 'src/components/asset-amount-input/asset-amount-input';
import { Divider } from 'src/components/divider/divider';
import { DropdownListItemComponent, DropdownValueComponent } from 'src/components/dropdown/dropdown';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TokenDropdownItem } from 'src/components/token-dropdown/token-dropdown-item/token-dropdown-item';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { FormDropdown } from 'src/form/form-dropdown';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useFarmsStakesLoadingSelector } from 'src/store/farms/selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { percentageToFraction } from 'src/utils/percentage.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { MINIMAL_DIVISIBLE_ATOMIC_AMOUNT, PERCENTAGE_OPTIONS } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageEarnOpportunityModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';

import { PERCENTAGE_OPTIONS_TEXTS } from './percentage-options';
import { useAssetAmountInputStylesConfig, useWithdrawFormStyles } from './styles';
import { useTokensOptions } from './use-tokens-options';
import { WithdrawFormValues, WithdrawTokenOption } from './use-withdraw-formik';

interface WithdrawFormProps {
  earnOpportunityItem: EarnOpportunity;
  stake?: UserStakeValueInterface;
  formik: FormikProps<WithdrawFormValues>;
}

const tokenOptionEqualityFn = (a: WithdrawTokenOption, b?: WithdrawTokenOption) =>
  getTokenSlug(a.token) === (b && getTokenSlug(b.token));

const getTokenDropdownItemToken = (value?: WithdrawTokenOption) =>
  value && {
    ...value.token,
    balance: value.amount?.toFixed() ?? ''
  };

const renderTokenOptionListItem: DropdownListItemComponent<WithdrawTokenOption> = ({ item, isSelected }) => (
  <TokenDropdownItem
    isShowBalanceLoading={!isDefined(item.amount)}
    token={getTokenDropdownItemToken(item)}
    {...(isSelected && { actionIconName: IconNameEnum.Check })}
  />
);

const tokenOptionTestIDPropertiesFn = (option: WithdrawTokenOption) => ({
  token: option.token.symbol
});

const PERCENTAGE_OPTIONS_INDICES = PERCENTAGE_OPTIONS.map((_, index) => index);

export const WithdrawForm: FC<WithdrawFormProps> = ({ earnOpportunityItem, formik, stake }) => {
  const fiatToUsdExchangeRate = useFiatToUsdRateSelector();
  const { depositExchangeRate, tokens, type: itemType } = earnOpportunityItem;
  const { stakedToken } = useEarnOpportunityTokens(earnOpportunityItem);
  const { setFieldTouched, setFieldValue, values } = formik;
  const { amountOptionIndex, tokenOption } = values;
  const depositAmountAtomic = useMemo(
    () => new BigNumber(stake?.depositAmountAtomic ?? 0),
    [stake?.depositAmountAtomic]
  );
  const lpAmountAtomic = useMemo(
    () =>
      depositAmountAtomic
        .times(percentageToFraction(PERCENTAGE_OPTIONS[amountOptionIndex]))
        .integerValue(BigNumber.ROUND_DOWN),
    [depositAmountAtomic, amountOptionIndex]
  );
  const tokensOptions = useTokensOptions(earnOpportunityItem, lpAmountAtomic);
  const assetAmountInputStylesConfig = useAssetAmountInputStylesConfig();
  const prevTokensOptionsRef = useRef<WithdrawTokenOption[]>();
  const [tokenSearchValue, setTokenSearchValue] = useState('');
  const filteredTokensOptions = useMemo(
    () => tokensOptions.filter(({ token }) => isAssetSearched(token, tokenSearchValue.toLowerCase())),
    [tokensOptions, tokenSearchValue]
  );
  const styles = useWithdrawFormStyles();
  const stakesLoading = useFarmsStakesLoadingSelector();

  const renderTokenOptionValue = useCallback<DropdownValueComponent<WithdrawTokenOption>>(
    ({ value }) => (
      <DropdownItemContainer style={styles.tokenSelector}>
        <TokenDropdownItem
          isShowBalanceLoading={isDefined(value) && !isDefined(value.amount)}
          token={getTokenDropdownItemToken(value)}
          actionIconName={IconNameEnum.TriangleDown}
        />
      </DropdownItemContainer>
    ),
    [styles]
  );

  const handleTokenOptionChange = useCallback(() => void setFieldTouched('tokenOption', true), [setFieldTouched]);

  const handleAmountOptionIndexChange = useCallback(
    (newIndex: number) => {
      setFieldValue('amountOptionIndex', newIndex);
      setFieldTouched('amountOptionIndex', true);
    },
    [setFieldValue, setFieldTouched]
  );

  useEffect(() => {
    if (prevTokensOptionsRef.current !== tokensOptions) {
      prevTokensOptionsRef.current = tokensOptions;
      const newTokenOption =
        tokensOptions.find(({ token }) => getTokenSlug(token) === getTokenSlug(tokenOption.token)) ?? tokensOptions[0];
      setFieldValue('tokenOption', newTokenOption);
    }
  }, [setFieldValue, tokensOptions, tokenOption]);

  const disabledPercentageOptionsIndices = useMemo(
    () =>
      itemType === EarnOpportunityTypeEnum.STABLESWAP || depositAmountAtomic.lt(MINIMAL_DIVISIBLE_ATOMIC_AMOUNT)
        ? [0, 1, 2]
        : [],
    [itemType, depositAmountAtomic]
  );

  useEffect(() => {
    if (disabledPercentageOptionsIndices.includes(amountOptionIndex)) {
      setFieldValue(
        'amountOptionIndex',
        PERCENTAGE_OPTIONS_INDICES.find(index => !disabledPercentageOptionsIndices.includes(index)) ??
          PERCENTAGE_OPTIONS.length - 1
      );
    }
  }, [disabledPercentageOptionsIndices, amountOptionIndex, setFieldValue]);

  const lpToken = useMemo<TokenInterface>(
    () => ({
      balance: depositAmountAtomic.toFixed(),
      visibility: VisibilityEnum.Visible,
      id: stakedToken.id ?? 0,
      decimals: stakedToken.decimals,
      symbol: tokens.length === 1 ? stakedToken.symbol : 'Shares',
      name: stakedToken.name,
      thumbnailUri: stakedToken.thumbnailUri,
      iconName: stakedToken.iconName,
      address: stakedToken.address,
      exchangeRate:
        isDefined(depositExchangeRate) && isDefined(fiatToUsdExchangeRate)
          ? Number(depositExchangeRate) * fiatToUsdExchangeRate
          : undefined
    }),
    [depositAmountAtomic, stakedToken, depositExchangeRate, fiatToUsdExchangeRate, tokens.length]
  );

  const amountInputAssetsList = useMemo<TokenInterface[]>(() => [lpToken], [lpToken]);
  const lpInputValue = useMemo(() => {
    const amount = mutezToTz(lpAmountAtomic, lpToken.decimals);

    return {
      asset: lpToken,
      amount: tzToMutez(amount.decimalPlaces(amount.lt(1000) ? 6 : 2, BigNumber.ROUND_FLOOR), lpToken.decimals)
    };
  }, [lpToken, lpAmountAtomic]);

  return (
    <FormikProvider value={formik}>
      <View>
        <Divider size={formatSize(12)} />
        <AssetAmountInput
          value={lpInputValue}
          label="Amount"
          assetsList={amountInputAssetsList}
          balanceLabel="Current deposit:"
          toUsdToggle={false}
          editable={false}
          isShowNameForValue={!isFarm(earnOpportunityItem)}
          isSingleAsset={true}
          stylesConfig={assetAmountInputStylesConfig}
          testID={ManageEarnOpportunityModalSelectors.sharesAmountInput}
          onValueChange={noop}
        />
        <Divider size={formatSize(16)} />
        <TextSegmentControl
          disabledIndexes={disabledPercentageOptionsIndices}
          selectedIndex={amountOptionIndex}
          values={PERCENTAGE_OPTIONS_TEXTS}
          onChange={handleAmountOptionIndexChange}
          testID={ManageEarnOpportunityModalSelectors.amountPercentageSwitcher}
        />
        <Divider size={formatSize(20)} />
        {isFarm(earnOpportunityItem) && (
          <>
            <Text style={styles.tokenSelectorTitle}>Receive in</Text>
            <Divider size={formatSize(12)} />
            <View style={styles.tokenSelectorWrapper}>
              <FormDropdown
                name="tokenOption"
                description="Choose token"
                itemHeight={formatSize(56)}
                equalityFn={tokenOptionEqualityFn}
                renderValue={renderTokenOptionValue}
                renderListItem={renderTokenOptionListItem}
                isSearchable={true}
                setSearchValue={setTokenSearchValue}
                list={filteredTokensOptions}
                itemTestIDPropertiesFn={tokenOptionTestIDPropertiesFn}
                onValueChange={handleTokenOptionChange}
                testID={ManageEarnOpportunityModalSelectors.tokenSelector}
              />
            </View>
          </>
        )}
      </View>
      <Divider size={formatSize(12)} />
      <DetailsSection
        earnOpportunityItem={earnOpportunityItem}
        stake={stake}
        shouldShowClaimRewardsButton={false}
        loading={stakesLoading && !isDefined(stake)}
      />
      <Divider size={formatSize(16)} />
      {(stake?.rewardsDueDate ?? Infinity) >= Date.now() && (
        <VestingPeriodDisclaimers earnOpportunityItem={earnOpportunityItem} />
      )}
    </FormikProvider>
  );
};
