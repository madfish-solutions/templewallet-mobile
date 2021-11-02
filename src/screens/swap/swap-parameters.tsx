import { findDex, FoundDex } from '@quipuswap/sdk';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FieldHelperProps, useField } from 'formik';
import { toString } from 'lodash-es';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, Text, TextInputKeyPressEventData, TouchableOpacity, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { DropdownEqualityFn } from '../../components/dropdown/dropdown';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SelectPercentageButton } from '../../components/select-percentage-button/select-percentage-button';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { WarningBlock } from '../../components/warning-block/warning-block';
import { SwapAssetAmoutInput } from '../../form/swap-asset-amount-input/swap-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { useLiquidityBakingAsset } from '../../store/swap/swap-selectors';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenInterface, emptyToken } from '../../token/interfaces/token.interface';
import { getTokenType } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import {
  estimateAssetToAsset,
  estimateAssetToAssetInverse,
  ExchangeTypeEnum,
  FEE,
  getAssetInput,
  getAssetOutput,
  numbersAndDotRegExp,
  QS_FACTORIES,
  SLIPPAGE_TOLERANCE_PRESETS,
  minimumReceived
} from '../../utils/swap.utils';
import { tzToMutez, mutezToTz } from '../../utils/tezos.util';
import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { SwapProviderDropdown } from './swap-provider-dropdown';
import { useSwapStyles } from './swap.styles';

export interface SwapFormValues {
  swapFromAmount: AssetAmountInterface;
  swapToAmount: AssetAmountInterface;
}

interface Props {
  tokenWhiteList: TokenMetadataResponse[];
  tokenWhiteListIsLoading: boolean;
  swapProvider: string;
  slippageTolerance: string;
  liquidityProviderDex: ContractAbstraction<ContractProvider> | undefined;
  setSwapProvider: React.Dispatch<React.SetStateAction<string>>;
  setSlippageTolerance: React.Dispatch<React.SetStateAction<string>>;
}

export const SwapForm: FC<Props> = ({
  tokenWhiteList,
  tokenWhiteListIsLoading,
  swapProvider,
  slippageTolerance,
  liquidityProviderDex,
  setSwapProvider,
  setSlippageTolerance
}) => {
  const theme = useThemeSelector();
  const [inputDexState, setInputDexState] = useState<FoundDex | ContractAbstraction<ContractProvider>>();
  const [outputDexState, setOutputDexState] = useState<FoundDex>();
  const [isDexLoaded, setIsDexLoaded] = useState<boolean>(false);
  const [swapFromField, , swapFromFieldHelper] = useField<AssetAmountInterface>('swapFromField');
  const [swapToField, , swapToFieldHelper] = useField<AssetAmountInterface>('swapToField');
  const [lastChangedInput, setLastChangedInput] = useState<string>('');
  const [isAdvancedParamsShown, setIsAdvancedParamsShown] = useState(false);
  const styles = useSwapStyles();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);
  const liquidityBakingAsset = useLiquidityBakingAsset();

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const findDexHandler = async (address: string) => {
    const tokenContract = await tezos.contract.at(address);
    const tokenType = getTokenType(tokenContract);
    const token = {
      contract: tokenContract,
      ...(tokenType === TokenTypeEnum.FA_2 && { id: new BigNumber(swapToField.value.asset.id) })
    };

    return await findDex(tezos, QS_FACTORIES, token);
  };

  const exchangeRate = useMemo(() => {
    if (
      !swapFromField.value.amount ||
      !swapFromField.value.amount ||
      !swapFromField.value.asset ||
      swapFromField.value.amount.eq(0)
    ) {
      return undefined;
    }
    const inputAssetAmount = tzToMutez(swapFromField.value.amount, swapFromField.value.asset.decimals);
    const outputAssetAmount = tzToMutez(swapToField.value.amount ?? new BigNumber(0), swapToField.value.asset.decimals);
    const rawExchangeRate = inputAssetAmount.div(outputAssetAmount);
    if (rawExchangeRate.eq(0)) {
      return { base: new BigNumber(1), value: new BigNumber(0) };
    }
    const base = new BigNumber(10).pow(
      BigNumber.max(0, -Math.floor(Math.log10(rawExchangeRate.toNumber())) - swapFromField.value.asset.decimals)
    );
    const prettifiedExchangeRate = rawExchangeRate.multipliedBy(base).decimalPlaces(swapFromField.value.asset.decimals);

    return { base, value: prettifiedExchangeRate };
  }, [swapFromField.value.amount, swapToField.value.amount, swapFromField.value.asset]);

  const onFocusHandler = (fieldName: string) => {
    setLastChangedInput(fieldName);
  };

  const equalityFn: DropdownEqualityFn<string> = (item, value) => {
    return item === value;
  };

  const quipuswapProviderHandler = (value: AssetAmountInterface) => {
    const tokenToToken =
      swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
      swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name;
    if (lastChangedInput === 'swapFromField') {
      if (tokenToToken) {
        if (isDexLoaded) {
          const intermediateTezValue = estimateAssetToAsset(
            inputDexState?.storage,
            tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
            ExchangeTypeEnum.TOKEN_TO_TEZ
          );
          const estimatedValue = estimateAssetToAsset(
            outputDexState?.storage,
            intermediateTezValue,
            ExchangeTypeEnum.TEZ_TO_TOKEN
          );

          const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: tzEstimatedVal
          });
          console.log(tzEstimatedVal);
          swapToFieldHelper.setTouched(true);
        }
      } else {
        const tokenToTez =
          swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
          swapToField.value.asset.name === TEZ_TOKEN_METADATA.name;

        if (isDexLoaded) {
          const estimatedValue = estimateAssetToAsset(
            inputDexState?.storage,
            tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
            tokenToTez ? ExchangeTypeEnum.TOKEN_TO_TEZ : ExchangeTypeEnum.TEZ_TO_TOKEN
          );

          const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: tzEstimatedVal
          });
        }
      }
    } else if (lastChangedInput === 'swapToField') {
      const tokenToTez =
        swapFromField.value.asset.name === TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name;
      if (tokenToToken) {
        const intermediateValue = estimateAssetToAssetInverse(
          outputDexState?.storage,
          tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
          ExchangeTypeEnum.TOKEN_TO_TEZ
        );
        const estimatedValue = estimateAssetToAssetInverse(
          inputDexState?.storage,
          intermediateValue,
          ExchangeTypeEnum.TEZ_TO_TOKEN
        );

        const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);

        swapFromFieldHelper.setValue({
          ...swapFromField.value,
          amount: tzEstimatedVal
        });
      } else {
        if (tokenToTez) {
          const estimatedValue = estimateAssetToAssetInverse(
            inputDexState?.storage,
            tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
            ExchangeTypeEnum.TOKEN_TO_TEZ
          );

          const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);

          swapFromFieldHelper.setValue({
            ...swapFromField.value,
            amount: tzEstimatedVal
          });
        } else {
          const estimatedValue = estimateAssetToAssetInverse(
            outputDexState?.storage,
            tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
            ExchangeTypeEnum.TEZ_TO_TOKEN
          );

          const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);

          swapFromFieldHelper.setValue({
            ...swapFromField.value,
            amount: tzEstimatedVal
          });
        }
      }
    }
  };

  const liquidityBakingProviderHandler = async (value: AssetAmountInterface) => {
    const tezToToken =
      swapFromField.value.asset.name === TEZ_TOKEN_METADATA.name &&
      swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name;
    if (isDexLoaded) {
      if (tezToToken) {
        if (lastChangedInput === 'swapFromField') {
          const estimatedValue = getAssetOutput(
            tzToMutez(value.amount ?? new BigNumber(0), value.asset.decimals),
            ExchangeTypeEnum.TEZ_TO_TOKEN,
            inputDexState as ContractAbstraction<ContractProvider>
          );

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: mutezToTz(estimatedValue, swapToField.value.asset.decimals)
          });
        } else {
          const estimatedValue = getAssetInput(
            tzToMutez(value.amount ?? new BigNumber(0), value.asset.decimals),
            ExchangeTypeEnum.TOKEN_TO_TEZ,
            inputDexState as ContractAbstraction<ContractProvider>
          );

          swapFromFieldHelper.setValue({
            ...swapFromField.value,
            amount: mutezToTz(estimatedValue, swapFromField.value.asset.decimals)
          });
        }
      } else {
        if (lastChangedInput === 'swapFromField') {
          const estimatedValue = getAssetOutput(
            tzToMutez(value.amount ?? new BigNumber(0), value.asset.decimals),
            ExchangeTypeEnum.TOKEN_TO_TEZ,
            inputDexState as ContractAbstraction<ContractProvider>
          );

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: mutezToTz(estimatedValue, swapToField.value.asset.decimals)
          });
        } else {
          const estimatedValue = getAssetInput(
            tzToMutez(value.amount ?? new BigNumber(0), value.asset.decimals),
            ExchangeTypeEnum.TEZ_TO_TOKEN,
            inputDexState as ContractAbstraction<ContractProvider>
          );

          swapFromFieldHelper.setValue({
            ...swapFromField.value,
            amount: mutezToTz(estimatedValue, swapFromField.value.asset.decimals)
          });
        }
      }
    }
  };

  const onChangeHandler = (value: AssetAmountInterface, helpers: FieldHelperProps<AssetAmountInterface>) => {
    if (swapProvider === 'quipuswap') {
      quipuswapProviderHandler(value);
    } else if (swapProvider === 'liquidity-baking') {
      liquidityBakingProviderHandler(value);
    }

    console.log({onChangeHandlerValue: value.amount});
    
    helpers.setValue({
      ...value,
      amount: value.amount
    });
  };

  useEffect(() => {
    setIsDexLoaded(false);
    if (swapProvider === 'quipuswap') {
      (async () => {
        if (
          swapFromField.value.asset.name === TEZ_TOKEN_METADATA.name &&
          swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
        ) {
          if (swapToField.value.asset.address !== '') {
            setInputDexState(await findDexHandler(swapToField.value.asset.address));
            setIsDexLoaded(true);
          }
        } else if (
          swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
          swapToField.value.asset.name === TEZ_TOKEN_METADATA.name
        ) {
          setOutputDexState(await findDexHandler(swapFromField.value.asset.address));
          setIsDexLoaded(true);
        } else if (
          swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
          swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
        ) {
          setInputDexState(await findDexHandler(swapFromField.value.asset.address));
          setOutputDexState(await findDexHandler(swapToField.value.asset.address));
          setIsDexLoaded(true);
        }
      })();
    } else if (swapProvider === 'liquidity-baking') {
      setInputDexState(undefined);
      setOutputDexState(undefined);
      (async () => {
        setInputDexState(liquidityProviderDex);
        setIsDexLoaded(true);
      })();
    }
  }, [swapFromField.value.asset, swapToField.value.asset, swapProvider]);

  useEffect(() => {
    if (swapProvider === 'liquidity-baking') {
      swapFromFieldHelper.setValue({
        asset: tezosToken,
        amount: new BigNumber(0)
      });
      swapToFieldHelper.setValue({
        asset: liquidityBakingAsset[0] as TokenInterface,
        amount: new BigNumber(0)
      });
    } else if (swapProvider === 'quipuswap') {
      swapFromFieldHelper.setValue({
        asset: tezosToken,
        amount: new BigNumber(0)
      });
      swapToFieldHelper.setValue({
        asset: emptyToken,
        amount: new BigNumber(0)
      });
    }
  }, [swapProvider]);

  const minimumReceivedValue = useMemo(
    () => minimumReceived(swapFromField.value, swapToField.value, slippageTolerance),
    [swapToField.value.amount, swapToField.value.asset, slippageTolerance]
  );

  const getTokenWhiteList = useMemo(() => {
    if (swapProvider === 'quipuswap') {
      return !tokenWhiteListIsLoading ? (tokenWhiteList as unknown as TokenInterface[]) : [];
    } else if (swapProvider === 'liquidity-baking') {
      return liquidityBakingAsset;
    }
  }, [swapProvider]);

  const swapAssetsHandler = () => {
    swapToFieldHelper.setValue({
      ...swapFromField.value,
      amount: new BigNumber(0)
    });
    swapFromFieldHelper.setValue({
      ...swapToField.value,
      amount: new BigNumber(0)
    });
  };

  const onSlippageButtonPressHandler = (value: string) => {
    setSlippageTolerance(value);
  };

  const onKeyPressSlippageHandler = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const value = slippageTolerance;
    if (isDefined(value) && value !== '') {
      if (value.indexOf('0') !== -1 && value.length === 1 && e.nativeEvent.key === '0') {
        e.preventDefault();

        return false;
      }
      if (value.indexOf('.') !== -1 && e.nativeEvent.key === '.') {
        e.preventDefault();

        return false;
      }
      if (!numbersAndDotRegExp.test(e.nativeEvent.key)) {
        e.preventDefault();

        return false;
      }
    }
  };

  const onChangeSlippageTolerance = (text: string) => {
    setSlippageTolerance(text);
  };

  const renderDropdownValue = () => (
    <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
      <Text style={styles.regularText}>Swap provider</Text>
      <View style={styles.rightSideWrapper}>
        {swapProvider === 'quipuswap' ? (
          <Icon
            name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
            width={formatSize(128)}
            height={formatSize(24)}
          />
        ) : null}
        {swapProvider === 'liquidity-baking' ? (
          <Icon
            name={theme === 'light' ? IconNameEnum.LbLogoBlack : IconNameEnum.LbLogoWhite}
            width={formatSize(128)}
            height={formatSize(24)}
          />
        ) : null}
        <Icon name={IconNameEnum.TriangleDown} size={formatSize(24)} />
      </View>
    </View>
  );

  const listItem = ({ item }: { item: string }) => (
    <View style={styles.horizontalWrapper}>
      {item === 'quipuswap' ? (
        <Icon
          name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
          width={formatSize(128)}
          height={formatSize(24)}
        />
      ) : null}
      {item === 'liquidity-baking' ? (
        <Icon
          name={theme === 'light' ? IconNameEnum.LbLogoBlack : IconNameEnum.LbLogoWhite}
          width={formatSize(128)}
          height={formatSize(24)}
        />
      ) : null}
      <Text style={styles.regularNumbers}>1.0 TOKEN = 2.000000 TMPL</Text>
    </View>
  );

  return (
    <>
      <SwapAssetAmoutInput
        name="swapFromField"
        label="From"
        assetsList={filteredAssetsListWithTez}
        onChangeHandler={onChangeHandler}
        onFocusHandler={onFocusHandler}
      />
      <TouchableOpacity style={styles.swapActionIconStyle} onPress={swapAssetsHandler}>
        <Icon name={IconNameEnum.SwapAction} size={formatSize(24)} />
      </TouchableOpacity>
      <SwapAssetAmoutInput
        name="swapToField"
        label="To"
        assetsList={getTokenWhiteList as unknown as TokenInterface[]}
        onChangeHandler={onChangeHandler}
        onFocusHandler={onFocusHandler}
      />
      <TouchableOpacity
        style={[styles.horizontalWrapper, styles.verticalMargin]}
        onPress={() => {
          setIsAdvancedParamsShown(!isAdvancedParamsShown);
        }}
      >
        <Text style={styles.boldText}>Advanced parameters</Text>
        <View style={styles.iconWrapper}>
          <Icon name={isAdvancedParamsShown ? IconNameEnum.ChevronUp : IconNameEnum.Gear} />
        </View>
      </TouchableOpacity>
      {isAdvancedParamsShown && (
        <View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <SwapProviderDropdown
              title={'Select provider to swap'}
              value={swapProvider}
              list={['quipuswap', 'liquidity-baking']}
              renderValue={renderDropdownValue}
              renderListItem={listItem}
              setValueHandler={setSwapProvider}
              equalityFn={equalityFn}
            />
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Exchange rate:</Text>
            <Text style={styles.regularNumbers}>
              {swapToField.value.asset && swapFromField.value.asset && exchangeRate
                ? `${exchangeRate.base} ${swapToField.value.asset.symbol} = ${exchangeRate.value} ${swapFromField.value.asset.symbol}`
                : '-'}
            </Text>
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Fee:</Text>
            <Text style={styles.regularNumbers}>{(1000 - FEE) / 10}%</Text>
          </View>
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Slippage tolerance:</Text>
            <View style={styles.rightSideWrapper}>
              {SLIPPAGE_TOLERANCE_PRESETS.map(preset => (
                <SelectPercentageButton
                  active={preset === slippageTolerance}
                  value={preset}
                  key={preset}
                  onPress={onSlippageButtonPressHandler}
                />
              ))}
            </View>
          </View>
          <StyledTextInput
            keyboardType="numeric"
            value={toString(slippageTolerance)}
            onChangeText={onChangeSlippageTolerance}
            onKeyPress={onKeyPressSlippageHandler}
            placeholder="Customize %"
          />
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Minimum received:</Text>
            <Text style={styles.regularNumbers}>{minimumReceivedValue}</Text>
          </View>
          <WarningBlock />
        </View>
      )}
    </>
  );
};
