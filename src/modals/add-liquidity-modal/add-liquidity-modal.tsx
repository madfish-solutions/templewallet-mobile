import { useRoute, RouteProp } from '@react-navigation/native';
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
import { TzBtcTokenContractAbstraction } from '../../interfaces/tz-btc-token.interface';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useContract } from '../../op-params/liquidity-baking/contracts';
import { getTransactionTimeoutDate } from '../../op-params/op-params.utils';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { LIQUIDITY_BAKING_DEX_ADDRESS, TZ_BTC_TOKEN_SLUG, TZ_BTC_TOKEN_ADDRESS } from '../../token/data/token-slugs';
import { emptyToken } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { findExchangeRate, findLpTokenAmount, findTokenInput } from '../../utils/dex.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz, tzToMutez } from '../../utils/tezos.util';
import { parseTransferParamsToParamsWithKind } from '../../utils/transfer-params.utils';
import { addLiquidityModalValidationSchema, AddLiquidityModalFormValues } from './add-liquidity-modal.form';
import { useAddLiquidityModalStyles } from './add-liquidity-modal.styles';

export const AddLiquidityModal = () => {
  const tzBtcLpContract = useRoute<RouteProp<ModalsParamList, ModalsEnum.RemoveLiquidity>>().params;
  const { navigate } = useNavigation();
  const styles = useAddLiquidityModalStyles();
  const assetsList = useAssetsListSelector();
  const { publicKeyHash } = useSelectedAccountSelector();

  const aToken = useTezosTokenSelector() ?? emptyToken;
  const bToken = assetsList.find(token => getTokenSlug(token) === TZ_BTC_TOKEN_SLUG) ?? emptyToken;

  const aTokenPool = tzBtcLpContract.storage.xtzPool;
  const bTokenPool = tzBtcLpContract.storage.tokenPool;
  const lpTotalSupply = tzBtcLpContract.storage.lqtTotal;

  const tzBtcTokenContract = useContract<TzBtcTokenContractAbstraction, undefined>(TZ_BTC_TOKEN_ADDRESS, undefined);

  const onSubmitHandler = (values: AddLiquidityModalFormValues) => {
    if (
      isDefined(values.aToken.amount) &&
      isDefined(values.bToken.amount) &&
      isDefined(tzBtcTokenContract.contract) &&
      isDefined(tzBtcLpContract.contract)
    ) {
      const lpTokensOutput = findLpTokenAmount(values.aToken.amount, lpTotalSupply, aTokenPool);

      const zeroApproveOpParams = tzBtcTokenContract.contract.methods
        .approve(LIQUIDITY_BAKING_DEX_ADDRESS, new BigNumber(0))
        .toTransferParams({ mutez: true });

      const bTokenApproveOpParams = tzBtcTokenContract.contract.methods
        .approve(LIQUIDITY_BAKING_DEX_ADDRESS, values.bToken.amount)
        .toTransferParams({ mutez: true });

      const transferParams = tzBtcLpContract.contract.methods
        .addLiquidity(publicKeyHash, lpTokensOutput, values.bToken.amount, getTransactionTimeoutDate())
        .toTransferParams({ mutez: true, amount: values.aToken.amount.toNumber() });

      const opParams = [
        ...parseTransferParamsToParamsWithKind(zeroApproveOpParams),
        ...parseTransferParamsToParamsWithKind(bTokenApproveOpParams),
        ...parseTransferParamsToParamsWithKind(transferParams),
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

  return (
    <>
      <Formik
        initialValues={addLiquidityModalInitialValues}
        validationSchema={addLiquidityModalValidationSchema}
        enableReinitialize={true}
        onSubmit={onSubmitHandler}
      >
        {({ values, setValues, setTouched, submitForm }) => {
          const aToBExchangeRate = findExchangeRate(values.aToken.asset, aTokenPool, values.bToken.asset, bTokenPool);
          const bToAExchangeRate = findExchangeRate(values.bToken.asset, bTokenPool, values.aToken.asset, aTokenPool);

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

          const handleATokenChange = (aToken: AssetAmountInterface) => {
            let bTokenAmount, aTokenAmount;
            if (isDefined(aToken.amount)) {
              aTokenAmount = aToken.amount;

              bTokenAmount = findTokenInput(bToAExchangeRate, mutezToTz(aTokenAmount, aToken.asset.decimals));
            }

            updateForm(aTokenAmount, tzToMutez(bTokenAmount ?? new BigNumber(0), values.bToken.asset.decimals));
          };

          const handleBTokenChange = (bToken: AssetAmountInterface) => {
            let bTokenAmount, aTokenAmount;
            if (isDefined(bToken.amount)) {
              bTokenAmount = bToken.amount;

              aTokenAmount = findTokenInput(aToBExchangeRate, mutezToTz(bTokenAmount, bToken.asset.decimals));
            }

            updateForm(tzToMutez(aTokenAmount ?? new BigNumber(0), values.aToken.asset.decimals), bTokenAmount);
          };

          return (
            <>
              <ModalStatusBar />
              <ScreenContainer>
                <FormAssetAmountInput
                  name="aToken"
                  label="Token A"
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
                  label="Token B"
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
                <ButtonLargePrimary title="Add" onPress={submitForm} />
              </View>
              <InsetSubstitute type="bottom" />
            </>
          );
        }}
      </Formik>
    </>
  );
};
