import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { tokenEqualityFn } from '../../components/token-amount-input/token-equality-fn';
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
import { SendModalContent } from './send-modal-content/send-modal-content';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

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

  const ownAccountsReceivers = useMemo(
    () => accounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [accounts, sender.publicKeyHash]
  );

  const initialAssetWithBalance = useMemo(
    () => filteredTokensListWithTez.find(item => tokenEqualityFn(item, initialToken)) ?? emptyToken,
    [filteredTokensListWithTez, initialToken]
  );

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      amount: { token: initialAssetWithBalance },
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false
    }),
    [filteredTokensListWithTez, ownAccountsReceivers, initialAssetWithBalance]
  );

  const onSubmit = ({ receiverPublicKeyHash, ownAccount, transferBetweenOwnAccounts, amount }: SendModalFormValues) => {
    isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          token: amount.token,
          receiverPublicKeyHash: transferBetweenOwnAccounts ? ownAccount.publicKeyHash : receiverPublicKeyHash,
          amount: amount.amount!.toNumber()
        })
      );
  };

  return (
    <Formik
      initialValues={sendModalInitialValues}
      enableReinitialize={true}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ values, submitForm }) => (
        <SendModalContent
          values={values}
          initialAsset={initialAssetWithBalance}
          submitForm={submitForm}
          tokensList={filteredTokensListWithTez}
          ownAccountsReceivers={ownAccountsReceivers}
        />
      )}
    </Formik>
  );
};
