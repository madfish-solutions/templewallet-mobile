import { BigNumber } from 'bignumber.js';
import { FormikProps, FormikProvider } from 'formik';
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
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { PERCENTAGE_OPTIONS } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageEarnOpportunityModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';
import { useAssetAmountInputStylesConfig, useWithdrawFormStyles } from './styles';
import { useTokensOptions } from './use-tokens-options';
import { WithdrawFormValues, WithdrawTokenOption } from './use-withdraw-formik';

interface WithdrawFormProps {
  earnOpportunityItem: EarnOpportunity;
  stake?: UserStakeValueInterface;
  formik: FormikProps<WithdrawFormValues>;
}

const PERCENTAGE_OPTIONS_TEXTS = PERCENTAGE_OPTIONS.map(value => `${value}%`);

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

export const WithdrawForm: FC<WithdrawFormProps> = ({ earnOpportunityItem, formik, stake }) => {
  const fiatToUsdExchangeRate = useFiatToUsdRateSelector();
  const { depositExchangeRate, tokens } = earnOpportunityItem;
  const { stakedToken } = useEarnOpportunityTokens(earnOpportunityItem);
  const { setFieldTouched, setFieldValue, values } = formik;
  const { amountOptionIndex, tokenOption } = values;
  const lpAmountAtomic = useMemo(
    () =>
      new BigNumber(stake?.depositAmountAtomic ?? 0)
        .times(PERCENTAGE_OPTIONS[amountOptionIndex])
        .dividedToIntegerBy(100),
    [stake?.depositAmountAtomic, amountOptionIndex]
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
  const stakesLoading = useStakesLoadingSelector();

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
    () => (earnOpportunityItem.type === EarnOpportunityTypeEnum.STABLESWAP ? [0, 1, 2] : []),
    [earnOpportunityItem.type]
  );

  const lpToken = useMemo<TokenInterface>(
    () => ({
      balance: stake?.depositAmountAtomic ?? '0',
      visibility: VisibilityEnum.Visible,
      id: stakedToken.id ?? 0,
      decimals: stakedToken.decimals,
      symbol: tokens.length === 1 ? stakedToken.symbol : 'Shares',
      name: stakedToken.name,
      thumbnailUri: stakedToken.thumbnailUri,
      address: stakedToken.address,
      exchangeRate:
        isDefined(depositExchangeRate) && isDefined(fiatToUsdExchangeRate)
          ? Number(depositExchangeRate) * fiatToUsdExchangeRate
          : undefined
    }),
    [stake?.depositAmountAtomic, stakedToken, depositExchangeRate, tokens.length]
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
          disabledValuesIndices={disabledPercentageOptionsIndices}
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
