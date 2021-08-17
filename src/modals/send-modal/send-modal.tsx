import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz } from '../../utils/tezos.util';
import { SendModalContent } from './send-modal-content';
import { createSendModalFormValidationSchema, SendModalFormValues } from './send-modal.form';

export const SendModal: FC = () => {
  const dispatch = useDispatch();
  const { token: initialToken, receiverPublicKeyHash: initialRecieverPublicKeyHash = '' } =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;

  const sender = useSelectedAccountSelector();
  const accounts = useAccountsListSelector();
  const tokensList = useTokensListSelector();
  const { filteredTokensList } = useFilteredTokenList(tokensList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredTokensListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredTokensList],
    [tezosToken, filteredTokensList]
  );

  const initialTokenWithBalance = useMemo(
    () => filteredTokensListWithTez.find(item => tokenEqualityFn(item, initialToken)) ?? emptyToken,
    [filteredTokensListWithTez, initialToken]
  );

  const [amountMaxValue, setAmountMaxValue] = useState<BigNumber>(
    mutezToTz(new BigNumber(initialTokenWithBalance.balance), initialTokenWithBalance.decimals)
  );

  const ownAccountsReceivers = useMemo(
    () => accounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [accounts, sender.publicKeyHash]
  );

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      token: initialTokenWithBalance,
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      amount: undefined,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false
    }),
    [initialTokenWithBalance, ownAccountsReceivers]
  );

  const sendModalValidationSchema = useMemo(
    () => createSendModalFormValidationSchema(amountMaxValue),
    [amountMaxValue]
  );

  const onSubmit = ({
    token,
    receiverPublicKeyHash,
    ownAccount,
    transferBetweenOwnAccounts,
    amount
  }: SendModalFormValues) =>
    void (
      isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          token,
          receiverPublicKeyHash: transferBetweenOwnAccounts ? ownAccount.publicKeyHash : receiverPublicKeyHash,
          amount: amount.toNumber()
        })
      )
    );

  return (
    <Formik
      initialValues={sendModalInitialValues}
      enableReinitialize={true}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ values, setFieldValue, submitForm }) => (
        <SendModalContent
          values={values}
          setFieldValue={setFieldValue}
          submitForm={submitForm}
          onMaxAmountChange={setAmountMaxValue}
        />
      )}
    </Formik>
  );
};
