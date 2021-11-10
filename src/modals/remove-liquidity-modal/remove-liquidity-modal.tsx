import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { LIQUIDITY_BAKING_DEX_ADDRESS, useContract } from '../../op-params/liquidity-baking/contracts';
import {
  LiquidityBakingStorage,
  liquidityBakingStorageInitialValue
} from '../../op-params/liquidity-baking/liquidity-baking-storage.interface';
import { LiquidityBakingContractAbstraction } from '../../op-params/liquidity-baking/liquidity-baking.contract-abstraction.interface';
import { getTransactionTimeoutDate } from '../../op-params/op-params.utils';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { findExchangeRate, findLpToTokenOutput, findTokenToLpInput } from '../../utils/dex.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { RemoveLiquidityModalFormValues, removeLiquidityModalValidationSchema } from './remove-liquidity-modal.form';
import { useRemoveLiquidityModalStyles } from './remove-liquidity-modal.styles';

export const RemoveLiquidityModal = () => {
  const { contract, storage } = useContract<LiquidityBakingContractAbstraction, LiquidityBakingStorage>(
    LIQUIDITY_BAKING_DEX_ADDRESS,
    liquidityBakingStorageInitialValue
  );

  const aTokenPool = storage.xtzPool;
  const bTokenPool = storage.tokenPool;
  const lpTotalSupply = storage.lqtTotal;

  const { publicKeyHash } = useSelectedAccountSelector();
  const styles = useRemoveLiquidityModalStyles();
  const assetsList = useAssetsListSelector();
  const tokenA = useTezosTokenSelector();

  const lpList = assetsList.filter(token => token.address === 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo');
  const tokenB = assetsList.filter(token => token.name === 'tzBTC')[0];

  const onSubmitHandler = (values: RemoveLiquidityModalFormValues) => {
    if (
      isDefined(values.lpToken.amount) &&
      isDefined(values.aToken.amount) &&
      isDefined(values.bToken.amount) &&
      isDefined(contract)
    ) {
      const result = contract.methods
        .removeLiquidity(
          publicKeyHash,
          values.lpToken.amount,
          values.aToken.amount,
          values.bToken.amount,
          getTransactionTimeoutDate()
        )
        .toTransferParams({ mutez: true });

      console.log(JSON.stringify(result));
    }
  };

  const removeLiquidityModalInitialValues = useMemo<RemoveLiquidityModalFormValues>(
    () => ({
      lpToken: {
        asset: lpList[0],
        amount: undefined
      },
      aToken: {
        asset: tokenA,
        amount: undefined
      },
      bToken: {
        asset: tokenB,
        amount: undefined
      }
    }),
    [lpList, tokenA, tokenB]
  );

  return (
    <>
      <Formik
        initialValues={removeLiquidityModalInitialValues}
        enableReinitialize={true}
        validationSchema={removeLiquidityModalValidationSchema}
        onSubmit={onSubmitHandler}
      >
        {({ values, setTouched, setValues, submitForm }) => {
          const aToBExchangeRate = findExchangeRate(values.aToken.asset, aTokenPool, values.bToken.asset, bTokenPool);
          const bToAExchangeRate = findExchangeRate(values.bToken.asset, bTokenPool, values.aToken.asset, aTokenPool);

          const updateForm = (lpTokenAmount?: BigNumber, aTokenAmount?: BigNumber, bTokenAmount?: BigNumber) => {
            setValues({
              ...values,
              lpToken: { ...values.lpToken, amount: lpTokenAmount },
              aToken: { ...values.aToken, amount: aTokenAmount },
              bToken: { ...values.bToken, amount: bTokenAmount }
            });

            setTimeout(() => {
              setTouched({
                lpToken: { amount: true },
                aToken: { amount: true },
                bToken: { amount: true }
              });
            });
          };
          const handleLpTokenChange = (lpToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;
            if (isDefined(lpToken.amount)) {
              lpTokenAmount = lpToken.amount;
              aTokenAmount = findLpToTokenOutput(lpTokenAmount, storage.lqtTotal, storage.xtzPool);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, storage.lqtTotal, storage.tokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleATokenChange = (aToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;
            if (isDefined(aToken.amount)) {
              aTokenAmount = aToken.amount;
              lpTokenAmount = findTokenToLpInput(aTokenAmount, storage.lqtTotal, storage.xtzPool);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, storage.lqtTotal, storage.tokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleBTokenChange = (bToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(bToken.amount)) {
              bTokenAmount = bToken.amount;
              lpTokenAmount = findTokenToLpInput(bTokenAmount, storage.lqtTotal, storage.tokenPool);
              aTokenAmount = findLpToTokenOutput(lpTokenAmount, storage.lqtTotal, storage.xtzPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };
          console.log(values.aToken.asset.decimals, values.bToken.asset.decimals);

          return (
            <>
              <ModalStatusBar />
              <ScreenContainer>
                <FormAssetAmountInput
                  name="lpToken"
                  label="Select LP"
                  assetsList={[values.lpToken.asset]}
                  onValueChange={handleLpTokenChange}
                />
                <Divider size={formatSize(16)} />
                <FormAssetAmountInput
                  name="aToken"
                  label="Output"
                  assetsList={[values.aToken.asset]}
                  onValueChange={handleATokenChange}
                />
                <Divider size={formatSize(16)} />
                <FormAssetAmountInput
                  name="bToken"
                  label="Output"
                  assetsList={[values.bToken.asset]}
                  onValueChange={handleBTokenChange}
                />
                <Text style={styles.sectionNameText}>Remove Liquidity Details</Text>
                <View style={styles.lineDivider} />
                <View style={styles.detailsItemWrapper}>
                  <Text style={styles.detailsDescription}>
                    Rate {values.aToken.asset.symbol}/{values.bToken.asset.symbol}
                  </Text>
                  <Text style={styles.detailsValue}>
                    <Text style={styles.approxEqual}>≈ </Text>
                    {formatAssetAmount(aToBExchangeRate)}
                  </Text>
                </View>
                <View style={styles.lineDivider} />
                <View style={styles.detailsItemWrapper}>
                  <Text style={styles.detailsDescription}>
                    Rate {values.bToken.asset.symbol}/{values.aToken.asset.symbol}
                  </Text>
                  <Text style={styles.detailsValue}>
                    <Text style={styles.approxEqual}>≈ </Text>
                    {formatAssetAmount(bToAExchangeRate)}
                  </Text>
                </View>
              </ScreenContainer>
              <View style={styles.submitButton}>
                <ButtonLargePrimary title="Remove" onPress={submitForm} />
              </View>
              <InsetSubstitute type="bottom" />
            </>
          );
        }}
      </Formik>
    </>
  );
};
