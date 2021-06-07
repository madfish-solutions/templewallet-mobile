import { RouteProp, useRoute } from '@react-navigation/core';
import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { forkJoin, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
import { ConfirmPayloadTypeEnum } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { EstimateInterface } from '../../interfaces/estimate.interface';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { tezos$ } from '../../utils/network/network.util';
import { tzToMutez } from '../../utils/tezos.util';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const asset = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params.asset;
  const { goBack, navigate } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const sendModalInitialValues: SendModalFormValues = {
    account: selectedAccount,
    amount: new BigNumber(0),
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
  };

  // TODO: integrate gasFee with send request
  const onSubmit = async (data: SendModalFormValues) => {
    let opParams: EstimateInterface['params'] = [];

    if (isDefined(asset.address)) {
      let transferParams;

      const contract = await forkJoin(tezos$, of(asset.address))
        .pipe(switchMap(([tezos, assetAddress]) => from(tezos.wallet.at(assetAddress))))
        .toPromise();

      if (asset.id === undefined) {
        transferParams = contract.methods
          .transfer(selectedAccount.publicKeyHash, data.recipient, tzToMutez(data.amount, asset.decimals).toString())
          .toTransferParams();
      } else {
        transferParams = contract.methods
          .transfer([
            {
              from_: selectedAccount.publicKeyHash,
              txs: [
                { to_: data.recipient, token_id: asset.id, amount: tzToMutez(data.amount, asset.decimals).toString() }
              ]
            }
          ])
          .toTransferParams();
      }
      opParams = [
        {
          kind: OpKind.TRANSACTION,
          ...transferParams
        }
      ];
    } else {
      opParams = [
        {
          kind: OpKind.TRANSACTION,
          amount: tzToMutez(data.amount, asset.decimals).toString(),
          to: data.recipient,
          mutez: true
        }
      ];
    }

    navigate(ModalsEnum.Confirm, {
      type: ConfirmPayloadTypeEnum.internalOperations,
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

            <Label label="Amount" description={`Set ${asset.symbol} amount to send.`} />
            <FormNumericInput name="amount" decimals={asset.decimals} />
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
