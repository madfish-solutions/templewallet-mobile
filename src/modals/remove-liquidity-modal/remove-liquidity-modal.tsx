import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { getTransactionTimeoutDate } from '../../op-params/op-params.utils';
import { useAssetsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { LIQUIDITY_BAKING_LP_SLUG } from '../../token/data/token-slugs';
import { emptyToken } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { findExchangeRate, findLpToTokenOutput, findTokenToLpInput } from '../../utils/dex.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { parseTransferParamsToParamsWithKind } from '../../utils/transfer-params.utils';
import { RemoveLiquidityModalFormValues, removeLiquidityModalValidationSchema } from './remove-liquidity-modal.form';
import { useRemoveLiquidityModalStyles } from './remove-liquidity-modal.styles';

export const RemoveLiquidityModal = () => {
  const { lpContract, aToken, bToken } = useRoute<RouteProp<ModalsParamList, ModalsEnum.RemoveLiquidity>>().params;

  const { navigate } = useNavigation();

  const aTokenPool = lpContract.storage.xtzPool;
  const bTokenPool = lpContract.storage.tokenPool;
  const lpTotalSupply = lpContract.storage.lqtTotal;

  const { publicKeyHash } = useSelectedAccountSelector();
  const styles = useRemoveLiquidityModalStyles();
  const assetsList = useAssetsListSelector();

  const lpToken = assetsList.find(token => getTokenSlug(token) === LIQUIDITY_BAKING_LP_SLUG) ?? emptyToken;

  const onSubmitHandler = (values: RemoveLiquidityModalFormValues) => {
    if (
      isDefined(values.lpToken.amount) &&
      isDefined(values.aToken.amount) &&
      isDefined(values.bToken.amount) &&
      isDefined(lpContract.contract)
    ) {
      const transferParams = lpContract.contract.methods
        .removeLiquidity(
          publicKeyHash,
          values.lpToken.amount,
          values.aToken.amount,
          values.bToken.amount,
          getTransactionTimeoutDate()
        )
        .toTransferParams({ mutez: true });

      const opParams = parseTransferParamsToParamsWithKind(transferParams);

      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams });
    }
  };

  const removeLiquidityModalInitialValues = useMemo<RemoveLiquidityModalFormValues>(
    () => ({
      lpToken: { asset: lpToken, amount: undefined },
      aToken: { asset: aToken, amount: undefined },
      bToken: { asset: bToken, amount: undefined }
    }),
    [lpToken, aToken, bToken]
  );

  return (
    <>
      <Formik
        initialValues={removeLiquidityModalInitialValues}
        validationSchema={removeLiquidityModalValidationSchema}
        enableReinitialize={true}
        onSubmit={onSubmitHandler}
      >
        {({ values, setTouched, setValues, submitForm }) => {
          const aToBExchangeRate = findExchangeRate(aTokenPool, bTokenPool);
          const bToAExchangeRate = findExchangeRate(bTokenPool, aTokenPool);

          const updateForm = (lpTokenAmount?: BigNumber, aTokenAmount?: BigNumber, bTokenAmount?: BigNumber) => {
            setValues({
              ...values,
              lpToken: { ...values.lpToken, amount: lpTokenAmount },
              aToken: { ...values.aToken, amount: aTokenAmount },
              bToken: { ...values.bToken, amount: bTokenAmount }
            });

            setTimeout(() =>
              setTouched({ lpToken: { amount: true }, aToken: { amount: true }, bToken: { amount: true } })
            );
          };
          const handleLpTokenChange = (lpToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(lpToken.amount)) {
              lpTokenAmount = lpToken.amount;
              aTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, aTokenPool);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, bTokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleATokenChange = (aToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(aToken.amount)) {
              aTokenAmount = aToken.amount;
              lpTokenAmount = findTokenToLpInput(aTokenAmount, lpTotalSupply, aTokenPool);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, bTokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleBTokenChange = (bToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(bToken.amount)) {
              bTokenAmount = bToken.amount;
              lpTokenAmount = findTokenToLpInput(bTokenAmount, lpTotalSupply, bTokenPool);
              aTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, aTokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

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
                <View style={styles.iconCentered}>
                  <Icon size={formatSize(24)} name={IconNameEnum.ArrowDown} />
                </View>
                <Divider size={formatSize(24)} />
                <FormAssetAmountInput
                  name="aToken"
                  label="Output"
                  assetsList={[values.aToken.asset]}
                  onValueChange={handleATokenChange}
                />
                <Divider size={formatSize(16)} />
                <View style={styles.iconCentered}>
                  <Icon size={formatSize(24)} name={IconNameEnum.PlusIconOrange} />
                </View>
                <Divider size={formatSize(24)} />
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
