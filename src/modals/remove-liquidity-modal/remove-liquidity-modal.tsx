import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

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
import { useLiquidityBakingContract } from '../../op-params/liquidity-baking/contracts';
import { getTransactionTimeoutDate } from '../../op-params/op-params.utils';
import { loadTokenMetadataActions } from '../../store/wallet/wallet-actions';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTokensMetadataSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import {
  LIQUIDITY_BAKING_LP_SLUG,
  LIQUIDITY_BAKING_LP_TOKEN_ADDRESS,
  LIQUIDITY_BAKING_LP_TOKEN_ID
} from '../../token/data/token-slugs';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { findExchangeRate, findLpToTokenOutput, findTokenToLpInput } from '../../utils/dex.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { parseTransferParamsToParamsWithKind } from '../../utils/transfer-params.utils';
import { RemoveLiquidityModalFormValues, removeLiquidityModalValidationSchema } from './remove-liquidity-modal.form';
import { useRemoveLiquidityModalStyles } from './remove-liquidity-modal.styles';

export const RemoveLiquidityModal = () => {
  const { lpContractAddress, aToken, bToken } =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.RemoveLiquidity>>().params;
  const lpContract = useLiquidityBakingContract(lpContractAddress);
  const dispatch = useDispatch();

  const { navigate } = useNavigation();

  const aTokenPool = lpContract.storage.xtzPool;
  const bTokenPool = lpContract.storage.tokenPool;
  const lpTotalSupply = lpContract.storage.lqtTotal;

  const { publicKeyHash } = useSelectedAccountSelector();
  const styles = useRemoveLiquidityModalStyles();
  const assetsList = useAssetsListSelector();
  const tokensMetadataRecord = useTokensMetadataSelector();

  const lpToken: TokenInterface = {
    ...emptyToken,
    ...tokensMetadataRecord[LIQUIDITY_BAKING_LP_SLUG],
    ...assetsList.find(token => getTokenSlug(token) === LIQUIDITY_BAKING_LP_SLUG)
  };

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

  useEffect(
    () =>
      void (
        lpToken.address === emptyToken.address &&
        dispatch(
          loadTokenMetadataActions.submit({
            address: LIQUIDITY_BAKING_LP_TOKEN_ADDRESS,
            id: LIQUIDITY_BAKING_LP_TOKEN_ID
          })
        )
      ),
    [lpToken]
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
          const handleLpTokenChange = (newLpToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(newLpToken.amount)) {
              lpTokenAmount = newLpToken.amount;
              aTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, aTokenPool);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, bTokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleATokenChange = (newAToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(newAToken.amount)) {
              aTokenAmount = newAToken.amount;
              lpTokenAmount = findTokenToLpInput(aTokenAmount, aTokenPool, lpTotalSupply);
              bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTotalSupply, bTokenPool);
            }

            updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
          };

          const handleBTokenChange = (newBToken: AssetAmountInterface) => {
            let lpTokenAmount, aTokenAmount, bTokenAmount;

            if (isDefined(newBToken.amount)) {
              bTokenAmount = newBToken.amount;
              lpTokenAmount = findTokenToLpInput(bTokenAmount, bTokenPool, lpTotalSupply);
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
