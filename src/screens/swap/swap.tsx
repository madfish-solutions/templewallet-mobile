import { swap, withTokenApprove } from '@quipuswap/sdk';
import { ContractAbstraction, ContractProvider, OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSwapTokensWhitelist } from '../../store/swap/swap-selectors';
import { useSelectedAccountSelector, useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { deadline, LIQUIDITY_BAKING_CONTRACT, minimumReceived, QS_FACTORIES } from '../../utils/swap.utils';
import { tzToMutez } from '../../utils/tezos.util';
import { SwapForm } from './swap-parameters';
import { swapFormInitialValues, swapFormValidationSchema } from './swap-parameters.form';
import { useSwapStyles } from './swap.styles';

export const Swap = () => {
  const { data: tokenWhiteList, isLoading } = useSwapTokensWhitelist();
  const tezosToken = useTezosTokenSelector();
  const styles = useSwapStyles();
  const { navigate } = useNavigation();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);
  const [slippageTolerance, setSlippageTolerance] = useState<string>('0.5');
  const [swapProvider, setSwapProvider] = useState('quipuswap');
  const [liquidityProviderDexStorage, setLiquidityProviderDexStorage] =
    useState<ContractAbstraction<ContractProvider>>();
  const [liquidityProviderDex, setLiquidityProviderDex] = useState<ContractAbstraction<ContractProvider>>();

  useEffect(() => {
    (async () => {
      const dex = await tezos.contract.at(LIQUIDITY_BAKING_CONTRACT);
      setLiquidityProviderDex(dex);
      setLiquidityProviderDexStorage(await dex.storage());
    })();
  }, []);

  const onSwapSubmitHandler = async ({
    swapFromField,
    swapToField
  }: {
    swapFromField: AssetAmountInterface;
    swapToField: AssetAmountInterface;
  }) => {
    if (swapProvider === 'quipuswap') {
      const formatAssetForSwap = (asset: TokenInterface) => {
        return asset.name !== TEZ_TOKEN_METADATA.name
          ? Object.assign({}, { contract: asset.address, id: asset.id })
          : 'tez';
      };

      const inputValue = tzToMutez(swapFromField.amount ?? new BigNumber(0), swapFromField.asset.decimals);
      const fromAsset = formatAssetForSwap(swapFromField.asset);
      const toAsset = formatAssetForSwap(swapToField.asset);

      try {
        const transferParamsArray = await swap(
          tezos,
          QS_FACTORIES,
          fromAsset,
          toAsset,
          inputValue,
          Number(slippageTolerance)
        );
        const opParams: ParamsWithKind[] = transferParamsArray.map(item => ({ ...item, kind: OpKind.TRANSACTION }));

        navigate(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams
        });
      } catch (e) {
        console.log({ e });
      }
    } else if (swapProvider === 'liquidity-baking') {
      if (swapFromField.asset.name !== TEZ_TOKEN_METADATA.name && isDefined(liquidityProviderDex)) {
        const transferParams = liquidityProviderDex.methods
          .tokenToXtz(
            selectedAccount.publicKeyHash,
            tzToMutez(swapFromField.amount ?? new BigNumber(0), swapFromField.asset.decimals),
            tzToMutez(
              new BigNumber(minimumReceived(swapFromField, swapToField, slippageTolerance) ?? 0) ?? new BigNumber(0),
              swapToField.asset.decimals
            ),
            deadline().toString()
          )
          .toTransferParams();

        const params = await withTokenApprove(
          tezos,
          { contract: swapFromField.asset.address }, // asset in SDK format (send {contract: 'contract_address'})
          selectedAccount.publicKeyHash,
          liquidityProviderDex.address,
          tzToMutez(swapFromField.amount ?? new BigNumber(0), swapFromField.asset.decimals),
          [transferParams]
        );

        const opParams: ParamsWithKind[] = params.map(item => ({ ...item, kind: OpKind.TRANSACTION }));

        navigate(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams
        });
      } else {
        if (isDefined(liquidityProviderDex)) {
          const transferParams = liquidityProviderDex.methods
            .xtzToToken(
              selectedAccount.publicKeyHash,
              tzToMutez(swapToField.amount ?? new BigNumber(0), swapToField.asset.decimals),
              deadline.toString()
            )
            .toTransferParams({
              amount: tzToMutez(swapFromField.amount ?? new BigNumber(0), swapFromField.asset.decimals).toNumber(),
              mutez: true
            });

          const opParams: ParamsWithKind[] = [transferParams].map(item => ({
            ...item,
            kind: OpKind.TRANSACTION
          }));

          navigate(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams
          });
        }
      }
    }
  };

  return (
    <Formik
      initialValues={swapFormInitialValues(tezosToken)}
      enableReinitialize={true}
      validationSchema={swapFormValidationSchema}
      onSubmit={onSwapSubmitHandler}
      validateOnChange={true}
    >
      {({ submitForm }) => (
        <>
          <ScreenContainer>
            <InsetSubstitute />
            <SwapForm
              tokenWhiteList={tokenWhiteList}
              tokenWhiteListIsLoading={isLoading}
              swapProvider={swapProvider}
              slippageTolerance={slippageTolerance}
              liquidityProviderDex={liquidityProviderDexStorage}
              setSwapProvider={setSwapProvider}
              setSlippageTolerance={setSlippageTolerance}
            />
          </ScreenContainer>
          <View style={styles.swapButton}>
            <ButtonLargePrimary title="Swap" onPress={submitForm} />
          </View>
        </>
      )}
    </Formik>
  );
};
