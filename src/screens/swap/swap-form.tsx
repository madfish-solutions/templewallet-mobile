import { findDex, FoundDex, estimateTezToToken } from '@quipuswap/sdk';
import { BigNumber } from 'bignumber.js';
import { FieldHelperProps, useField } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, Text, TextInputChangeEventData, TouchableOpacity, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SelectPercentageButton } from '../../components/select-percentage-button/select-percentage-button';
import { StyledTextInput } from '../../components/styled-text-input/styled-text-input';
import { WarningBlock } from '../../components/warning-block/warning-block';
import { SwapAssetAmoutInput } from '../../form/swap-asset-amount-input/swap-asset-amount-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenType } from '../../token/utils/token.utils';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { tzToMutez, mutezToTz } from '../../utils/tezos.util';
import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { SwapProviderDropdown } from './swap-provider-dropdown';
import { useSwapStyles } from './swap.styles';

export interface SwapFormValues {
  swapFromAmount: AssetAmountInterface;
}

const slippageTolerancePresets = [0.5, 1, 3];
const FEE = 997;
export const QS_FACTORIES = {
  fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
  fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
};

interface Props {
  tokenWhiteList: TokenMetadataResponse[];
  tokenWhiteListIsLoading: boolean;
}

enum ExchangeTypeEnum {
  TEZ_TO_TOKEN = 'TEZ_TO_TOKEN',
  TOKEN_TO_TEZ = 'TOKEN_TO_TEZ',
  TOKEN_TO_TOKEN = 'TOKEN_TO_TOKEN'
}

const dexesInitialState = {
  outputDex: undefined,
  inputDex: undefined
};

export const SwapForm: FC<Props> = ({ tokenWhiteList, tokenWhiteListIsLoading }) => {
  const theme = useThemeSelector();
  const [inputDexState, setInputDexState] = useState<FoundDex>();
  const [outputDexState, setOutputDexState] = useState<FoundDex>();
  const [isDexLoaded, setIsDexLoaded] = useState<boolean>(false);
  const [swapProvider, setSwapProvider] = useState('provider1');
  const [swapFromField, , swapFromFieldHelper] = useField<AssetAmountInterface>('swapFromAmount');
  const [swapToField, , swapToFieldHelper] = useField<AssetAmountInterface>('swapToAmount');
  const [lastChangedInput, setLastChangedInput] = useState<string>('');
  const [isAdvancedParamsShown, setIsAdvancedParamsShown] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [estimatedAssetAmountState, setEstimatedAssetAmountState] = useState<BigNumber>(new BigNumber(0));
  const styles = useSwapStyles();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);

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

  const minimumReceived = useMemo(() => {
    if ([swapFromField.value.amount, swapToField.value.amount, swapToField.value.asset].includes(undefined)) {
      return undefined;
    }
    const tokensParts = new BigNumber(10).pow(swapToField.value.asset.decimals);

    const outputAssetAmount = swapToField.value.amount ?? new BigNumber(0);

    return new BigNumber(outputAssetAmount)
      .multipliedBy(tokensParts)
      .multipliedBy(100 - slippageTolerance)
      .idiv(100)
      .dividedBy(tokensParts)
      .toFixed();
  }, [swapToField.value.amount, swapToField.value.asset, slippageTolerance]);

  const onFocusHandler = (fieldName: string) => {
    setLastChangedInput(fieldName);
  };

  const estimateAssetToAsset = (dexStorage: FoundDex['storage'], value: BigNumber, exchangeType: ExchangeTypeEnum) => {
    const valueBN = new BigNumber(value);
    if (valueBN.isZero()) {
      return new BigNumber(0);
    }
    const tezInWithFee = new BigNumber(valueBN).times(FEE);
    const numerator = tezInWithFee.times(
      exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN ? dexStorage.storage.token_pool : dexStorage.storage.tez_pool
    );
    const denominator = new BigNumber(
      exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN ? dexStorage.storage.tez_pool : dexStorage.storage.token_pool
    )
      .times(1000)
      .plus(tezInWithFee);

    return numerator.idiv(denominator);
  };

  const estimateAssetToAssetInverse = (
    dexStorage: FoundDex['storage'],
    value: BigNumber,
    exchangeType: ExchangeTypeEnum
  ) => {
    const tokenValueBN = new BigNumber(value);
    if (tokenValueBN.isZero()) {
      return new BigNumber(0);
    }

    const numerator = new BigNumber(
      exchangeType === ExchangeTypeEnum.TOKEN_TO_TEZ ? dexStorage.storage.tez_pool : dexStorage.storage.token_pool
    )
      .times(1000)
      .times(tokenValueBN);
    const denominator = new BigNumber(
      exchangeType === ExchangeTypeEnum.TOKEN_TO_TEZ ? dexStorage.storage.token_pool : dexStorage.storage.tez_pool
    )
      .minus(tokenValueBN)
      .times(FEE);

    return numerator.idiv(denominator);
  };

  const onChangeHandler = (
    value: AssetAmountInterface,
    name: string,
    helpers: FieldHelperProps<AssetAmountInterface>
  ) => {
    const tokenToToken =
      swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
      swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name;
    if (lastChangedInput === 'swapFromAmount') {
      if (tokenToToken) {
        if (isDexLoaded) {
          const intermediateTezValue = estimateAssetToAsset(
            inputDexState?.storage,
            tzToMutez(new BigNumber(value.amount ?? 0), value.asset.decimals),
            ExchangeTypeEnum.TOKEN_TO_TEZ
          );
          console.log(intermediateTezValue);
          const estimatedValue = estimateAssetToAsset(
            outputDexState?.storage,
            intermediateTezValue,
            ExchangeTypeEnum.TEZ_TO_TOKEN
          );

          const tzEstimatedVal = mutezToTz(new BigNumber(estimatedValue), swapToField.value.asset.decimals);
          setEstimatedAssetAmountState(tzEstimatedVal);

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: tzEstimatedVal
          });
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
          setEstimatedAssetAmountState(tzEstimatedVal);

          swapToFieldHelper.setValue({
            ...swapToField.value,
            amount: tzEstimatedVal
          });
        }
      }
    } else if (lastChangedInput === 'swapToAmount') {
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
        setEstimatedAssetAmountState(swapToField.value.amount ?? new BigNumber(0));

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
          setEstimatedAssetAmountState(swapToField.value.amount ?? new BigNumber(0));

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
          setEstimatedAssetAmountState(swapToField.value.amount ?? new BigNumber(0));

          swapFromFieldHelper.setValue({
            ...swapFromField.value,
            amount: tzEstimatedVal
          });
        }
      }
    }
    helpers.setValue({
      ...value,
      amount: value.amount
    });
  };

  useEffect(() => {
    console.log('test', estimatedAssetAmountState.toFixed());
    console.log(exchangeRate);
  }, [swapToField.value.amount, swapFromField.value.amount]);

  // refactor into separate function findDex
  useEffect(() => {
    setIsDexLoaded(false);
    (async () => {
      if (
        swapFromField.value.asset.name === TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
      ) {
        try {
          if (swapToField.value.asset.address !== '') {
            setInputDexState(await findDexHandler(swapToField.value.asset.address));
            setIsDexLoaded(true);
          }
        } catch (e) {
          console.log({ e });
        }
      } else if (
        swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name === TEZ_TOKEN_METADATA.name
      ) {
        try {
          setOutputDexState(await findDexHandler(swapFromField.value.asset.address));
          setIsDexLoaded(true);
        } catch (e) {
          console.log({ e });
        }
      } else if (
        swapFromField.value.asset.name !== TEZ_TOKEN_METADATA.name &&
        swapToField.value.asset.name !== TEZ_TOKEN_METADATA.name
      ) {
        try {
          setInputDexState(await findDexHandler(swapFromField.value.asset.address));
          setOutputDexState(await findDexHandler(swapToField.value.asset.address));
          setIsDexLoaded(true);
        } catch (e) {
          console.log({ e });
        }
      }
    })();
  }, [swapFromField.value.asset, swapToField.value.asset]);

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

  const onSlippageButtonPressHandler = (value: number) => {
    setSlippageTolerance(value);
  };

  const onChangeSlippageHandler = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSlippageTolerance(0);
    console.log({ e });
  };

  const renderDropdownValue = () => (
    <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
      <Text style={styles.regularText}>Swap provider</Text>
      <View style={styles.rightSideWrapper}>
        <Icon
          name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
          width={formatSize(128)}
          height={formatSize(24)}
        />
        <Icon name={IconNameEnum.TriangleDown} size={formatSize(24)} />
      </View>
    </View>
  );

  const listItem = () => (
    <View style={styles.horizontalWrapper}>
      <Icon
        name={theme === 'light' ? IconNameEnum.QuipuswapNewLogoBlack : IconNameEnum.QuipuswapNewLogoWhite}
        width={formatSize(128)}
        height={formatSize(24)}
      />
      <Text style={styles.regularNumbers}>1.0 TOKEN = 2.000000 TMPL</Text>
    </View>
  );

  return (
    <>
      <SwapAssetAmoutInput
        name="swapFromAmount"
        label="From"
        assetsList={filteredAssetsListWithTez}
        onChangeHandler={onChangeHandler}
        onFocusHandler={onFocusHandler}
      />
      <TouchableOpacity style={styles.swapActionIconStyle} onPress={swapAssetsHandler}>
        <Icon name={IconNameEnum.SwapAction} size={formatSize(24)} />
      </TouchableOpacity>
      <SwapAssetAmoutInput
        name="swapToAmount"
        label="To"
        assetsList={
          !tokenWhiteListIsLoading && tokenWhiteList !== [] ? (tokenWhiteList as unknown as TokenInterface[]) : []
        }
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
              value={swapProvider}
              renderValue={renderDropdownValue}
              listItem={listItem}
              setValueHandler={setSwapProvider}
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
              {slippageTolerancePresets.map(preset => (
                <SelectPercentageButton
                  active={preset === slippageTolerance}
                  value={preset}
                  key={preset}
                  onPress={onSlippageButtonPressHandler}
                />
              ))}
            </View>
          </View>
          <StyledTextInput onChange={onChangeSlippageHandler} placeholder="Customize %" />
          <View style={[styles.horizontalWrapper, styles.verticalMargin]}>
            <Text style={styles.regularText}>Minimum received:</Text>
            <Text style={styles.regularNumbers}>{minimumReceived}</Text>
          </View>
          <WarningBlock />
        </View>
      )}
    </>
  );
};
