import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getExchangeRateKey } from '../../utils/exchange-rate.utils';
import { isDefined } from '../../utils/is-defined';
import { SendModalContent } from './send-modal-content/send-modal-content';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const dispatch = useDispatch();
  const { asset: initialAsset, receiverPublicKeyHash: initialRecieverPublicKeyHash = '' } =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;

  const { exchangeRates } = useExchangeRatesSelector();
  const sender = useSelectedAccountSelector();
  const accounts = useAccountsListSelector();
  const tokensList = useTokensListSelector();
  const { filteredTokensList } = useFilteredTokenList(tokensList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredTokensListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredTokensList],
    [tezosToken, filteredTokensList]
  );

  const ownAccountsReceivers = useMemo(
    () => accounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [accounts, sender.publicKeyHash]
  );

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      token: filteredTokensListWithTez.find(item => tokenEqualityFn(item, initialAsset)) ?? emptyToken,
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      amount: undefined,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false,
      amountUnitIndex: 0
    }),
    [filteredTokensListWithTez, ownAccountsReceivers]
  );

  const onSubmit = ({
    token,
    receiverPublicKeyHash,
    ownAccount,
    transferBetweenOwnAccounts,
    amount,
    amountUnitIndex
  }: SendModalFormValues) => {
    isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          asset: token,
          receiverPublicKeyHash: transferBetweenOwnAccounts ? ownAccount.publicKeyHash : receiverPublicKeyHash,
          amount: (amountUnitIndex === 0
            ? amount
            : amount
                .div(exchangeRates.data[getExchangeRateKey(token)])
                .decimalPlaces(token.decimals, BigNumber.ROUND_FLOOR)
          ).toNumber()
        })
      );
  };

  return (
    <Formik
      initialValues={sendModalInitialValues}
      enableReinitialize={true}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ values, setFieldValue, submitForm }) => (
        <SendModalContent
          values={values}
          initialAssetSymbol={initialAsset.symbol}
          setFieldValue={setFieldValue}
          submitForm={submitForm}
          tokensList={filteredTokensListWithTez}
          ownAccountsReceivers={ownAccountsReceivers}
        />
      )}
    </Formik>
  );
};
