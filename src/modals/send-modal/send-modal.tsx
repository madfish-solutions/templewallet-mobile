import { RouteProp, useRoute } from '@react-navigation/core';
import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { from, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormNumericInput } from '../../form/form-numeric-input';
import { FormTextInput } from '../../form/form-text-input';
import { ConfirmPayloadType } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { EstimateInterface } from '../../interfaces/estimate.interface';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { tezos$ } from '../../utils/network/network.util';
import { tzToMutez } from '../../utils/tezos.util';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

const MIN_AMOUNT = new BigNumber(0);

export const SendModal: FC = () => {
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>();
  const { goBack, navigate } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const token = params.token;

  const sendModalInitialValues: SendModalFormValues = {
    account: selectedAccount,
    amount: new BigNumber(0),
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
  };

  // TODO: integrate gasFee with send request
  const onSubmit = async (data: SendModalFormValues) => {
    let opParams: EstimateInterface['params'] = [
      {
        kind: OpKind.TRANSACTION,
        amount: tzToMutez(data.amount, XTZ_TOKEN_METADATA.decimals).toString(),
        to: data.recipient,
        mutez: true
      }
    ];
    if (token) {
      const contract = await of(token.address)
        .pipe(
          withLatestFrom(tezos$),
          switchMap(([tokenAddress, tezos]) => from(tezos.wallet.at(tokenAddress)))
        )
        .toPromise();
      let transferParams;

      if (token.type === TokenTypeEnum.FA_2) {
        transferParams = contract.methods
          .transfer([
            {
              from_: selectedAccount.publicKeyHash,
              txs: [
                { to_: data.recipient, token_id: token.id, amount: tzToMutez(data.amount, token.decimals).toString() }
              ]
            }
          ])
          .toTransferParams();
      } else {
        transferParams = contract.methods
          .transfer(selectedAccount.publicKeyHash, data.recipient, tzToMutez(data.amount, token.decimals).toString())
          .toTransferParams();
      }
      opParams = [
        {
          kind: OpKind.TRANSACTION,
          ...transferParams
        }
      ];
    }
    navigate(ModalsEnum.Confirm, {
      type: ConfirmPayloadType.internalOperations,
      sourcePkh: data.account.publicKeyHash,
      opParams
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={sendModalInitialValues}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="From" description="Select account to send from." />
            <AccountFormDropdown name="account" list={hdAccounts} />
            <Divider />

            <Label label="To" description="Address or Tezos domain to send tez funds to." />
            <FormTextInput name="recipient" />
            <Divider />

            <Label label="Amount" description={`Set ${token?.symbol ?? 'XTZ'} amount to send.`} />
            <FormNumericInput
              name="amount"
              decimals={token?.decimals ?? XTZ_TOKEN_METADATA.decimals}
              min={MIN_AMOUNT}
            />
            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Send" onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
