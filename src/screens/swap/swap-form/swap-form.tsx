import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useTokensWithTezosListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { isString } from '../../../utils/is-string';
import { useSwapStyles } from '../swap.styles';
import { SwapAssetsButton } from './swap-assets-button';
import { SwapController } from './swap-controller';
import { SwapExchangeRate } from './swap-exchange-rate';
import { SwapFormAmountInput } from './swap-form-amount-input';
import { SwapRoute } from './swap-router';
import { SwapSubmitButton } from './swap-submit-button';

export function atomsToTokens(x: BigNumber, decimals: number) {
  return x.integerValue().div(new BigNumber(10).pow(decimals));
}

export function tokensToAtoms(x: BigNumber, decimals: number) {
  return x.times(new BigNumber(10).pow(decimals)).integerValue();
}

interface SwapFormProps {
  loadingHasFailed: boolean;
}

export const SwapForm: FC<SwapFormProps> = ({ loadingHasFailed }) => {
  const assetsList = useTokensWithTezosListSelector();
  const styles = useSwapStyles();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assetsList, true);

  const [searchValue, setSearchTezAssetsValue] = useState<string>();

  const assetsListWithTez = useMemo(() => {
    const sourceArray = assetsList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of sourceArray) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sourceArray;
    }
  }, [searchValue, assetsList]);

  return (
    <>
      <View style={styles.container}>
        <SwapController />
        <SwapFormAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          assetsList={filteredAssetsList}
          setSearchValue={setSearchValue}
        />
        <SwapAssetsButton />
        <SwapFormAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={{ start: 0, end: 0 }}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={assetsListWithTez}
          setSearchValue={setSearchTezAssetsValue}
        />
        <Label label="Swap route" />
        <View>
          <SwapRoute loadingHasFailed={loadingHasFailed} />

          <Divider />
          <View>
            <SwapExchangeRate />
          </View>
        </View>
        <Divider size={formatSize(16)} />
      </View>
      <SwapSubmitButton />
    </>
  );
};
