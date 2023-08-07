import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { Fa12TokenContractAbstraction } from '../../interfaces/fa-1-2-token.interface';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useContract, useLiquidityBakingContract } from '../../op-params/liquidity-baking/contracts';
import { getTransactionTimeoutDate } from '../../op-params/op-params.utils';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../../token/data/token-slugs';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { findExchangeRate, findLpTokenAmount, findTokenInput } from '../../utils/dex.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { parseTransferParamsToParamsWithKind } from '../../utils/transfer-params.utils';
import { AddLiquidityModalFormValues, addLiquidityModalValidationSchema } from './add-liquidity-modal.form';
import { AddLiquidityModalSelectors } from './add-liquidity-modal.selectors';
import { useAddLiquidityModalStyles } from './add-liquidity-modal.styles';

export const AddLiquidityModal = () => {
  const { lpContractAddress, aToken, bToken } = useRoute<RouteProp<ModalsParamList, ModalsEnum.AddLiquidity>>().params;
  const lpContract = useLiquidityBakingContract(lpContractAddress);
  const { navigate } = useNavigation();
  const styles = useAddLiquidityModalStyles();
  const { publicKeyHash } = useSelectedAccountSelector();

  const aTokenPool = lpContract.storage.xtzPool;
  const bTokenPool = lpContract.storage.tokenPool;
  const lpTotalSupply = lpContract.storage.lqtTotal;

  const bTokenContract = useContract<Fa12TokenContractAbstraction, undefined>(bToken.address, undefined);

  const onSubmitHandler = (values: AddLiquidityModalFormValues) => {
    if (
      isDefined(values.aToken.amount) &&
      isDefined(values.bToken.amount) &&
      isDefined(bTokenContract.contract) &&
      isDefined(lpContract.contract)
    ) {
      const lpTokensOutput = findLpTokenAmount(values.aToken.amount, aTokenPool, lpTotalSupply);

      const zeroApproveOpParams = bTokenContract.contract.methods
        .approve(LIQUIDITY_BAKING_DEX_ADDRESS, new BigNumber(0))
        .toTransferParams({ mutez: true });

      const bTokenApproveOpParams = bTokenContract.contract.methods
        .approve(LIQUIDITY_BAKING_DEX_ADDRESS, values.bToken.amount)
        .toTransferParams({ mutez: true });

      const addLiquidityParams = lpContract.contract.methods
        .addLiquidity(publicKeyHash, lpTokensOutput, values.bToken.amount, getTransactionTimeoutDate())
        .toTransferParams({ mutez: true, amount: values.aToken.amount.toNumber() });

      const opParams = [
        ...parseTransferParamsToParamsWithKind(zeroApproveOpParams),
        ...parseTransferParamsToParamsWithKind(bTokenApproveOpParams),
        ...parseTransferParamsToParamsWithKind(addLiquidityParams),
        ...parseTransferParamsToParamsWithKind(zeroApproveOpParams)
      ];

      navigate(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams
      });
    }
  };

  const addLiquidityModalInitialValues = useMemo<AddLiquidityModalFormValues>(
    () => ({
      aToken: { asset: aToken, amount: undefined },
      bToken: { asset: bToken, amount: undefined }
    }),
    [aToken, bToken]
  );

  usePageAnalytic(ModalsEnum.AddLiquidity, `${aToken.address}_${aToken.id} ${bToken.address}_${bToken.id}`);

  return (
    <>
      <Formik
        initialValues={addLiquidityModalInitialValues}
        validationSchema={addLiquidityModalValidationSchema}
        enableReinitialize={true}
        onSubmit={onSubmitHandler}
      >
        {({ values, setValues, setTouched, submitForm }) => {
          const updateForm = (aTokenAmount?: BigNumber, bTokenAmount?: BigNumber) => {
            setValues({
              ...values,
              aToken: { ...values.aToken, amount: aTokenAmount },
              bToken: { ...values.bToken, amount: bTokenAmount }
            });

            setTimeout(() => {
              setTouched({ aToken: { amount: true }, bToken: { amount: true } });
            });
          };

          const handleATokenChange = (tokenA: AssetAmountInterface) => {
            let bTokenAmount, aTokenAmount;

            if (isDefined(tokenA.amount)) {
              aTokenAmount = tokenA.amount;
              bTokenAmount = findTokenInput(tokenA.amount, aTokenPool, bTokenPool);
            }

            updateForm(aTokenAmount, bTokenAmount ?? new BigNumber(0));
          };

          const handleBTokenChange = (tokenB: AssetAmountInterface) => {
            let bTokenAmount, aTokenAmount;

            if (isDefined(tokenB.amount)) {
              bTokenAmount = tokenB.amount;
              aTokenAmount = findTokenInput(tokenB.amount, bTokenPool, aTokenPool).minus(1);
            }

            updateForm(aTokenAmount ?? new BigNumber(0), bTokenAmount);
          };

          return (
            <>
              <ModalStatusBar />
              <ScreenContainer>
                <FormAssetAmountInput
                  name="aToken"
                  label="Token A"
                  assetsList={[values.aToken.asset]}
                  maxButton
                  onValueChange={handleATokenChange}
                  testID={AddLiquidityModalSelectors.aTokenDropdown}
                  switcherTestID={AddLiquidityModalSelectors.aTokenSwitcher}
                  maxButtonTestID={AddLiquidityModalSelectors.aTokenMaxButton}
                />
                <Divider size={formatSize(16)} />
                <View style={styles.iconCentered}>
                  <Icon size={formatSize(24)} name={IconNameEnum.PlusIconOrange} />
                </View>
                <Divider size={formatSize(24)} />
                <FormAssetAmountInput
                  name="bToken"
                  label="Token B"
                  assetsList={[values.bToken.asset]}
                  maxButton
                  onValueChange={handleBTokenChange}
                  testID={AddLiquidityModalSelectors.bTokenDropdown}
                  switcherTestID={AddLiquidityModalSelectors.bTokenSwitcher}
                  maxButtonTestID={AddLiquidityModalSelectors.bTokenMaxButton}
                />
                <Text style={styles.sectionNameText}>Remove Liquidity Details</Text>
                <View style={styles.lineDivider} />
                <View style={styles.detailsItemWrapper}>
                  <Text style={styles.detailsDescription}>
                    Rate {values.aToken.asset.symbol}/{values.bToken.asset.symbol}
                  </Text>
                  <Text style={styles.detailsValue}>
                    <Text style={styles.approxEqual}>≈ </Text>
                    {formatAssetAmount(findExchangeRate(aTokenPool, aToken.decimals, bTokenPool, bToken.decimals))}
                  </Text>
                </View>
                <View style={styles.lineDivider} />
                <View style={styles.detailsItemWrapper}>
                  <Text style={styles.detailsDescription}>
                    Rate {values.bToken.asset.symbol}/{values.aToken.asset.symbol}
                  </Text>
                  <Text style={styles.detailsValue}>
                    <Text style={styles.approxEqual}>≈ </Text>
                    {formatAssetAmount(findExchangeRate(bTokenPool, bToken.decimals, aTokenPool, aToken.decimals))}
                  </Text>
                </View>
              </ScreenContainer>
              <ButtonsFloatingContainer>
                <ButtonLargePrimary title="Add" onPress={submitForm} testID={AddLiquidityModalSelectors.addButton} />
              </ButtonsFloatingContainer>
              <InsetSubstitute type="bottom" />
            </>
          );
        }}
      </Formik>
    </>
  );
};
