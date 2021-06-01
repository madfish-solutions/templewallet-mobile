import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { from } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

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
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import {
  useHdAccountsListSelector,
  useSelectedAccountSelector,
  useTokenSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { tezos$ } from '../../utils/network/network.util';
import { MAINNET_NETWORK } from '../../utils/network/networks';
import { tzToMutez } from '../../utils/tezos.util';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const { params } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>();
  const { goBack, navigate } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const tokenSlug = params?.slug ?? '';
  const token = useTokenSelector(tokenSlug);
  console.log(token);

  const SendBottomSheetInitialValues: SendModalFormValues = useMemo(
    () => ({
      account: selectedAccount,
      amount: new BigNumber(0),
      recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
    }),
    [selectedAccount]
  );

  // TODO: integrate gasFee with send request
  const onSubmit = useCallback(
    async (data: SendModalFormValues) => {
      let opParams: any[] = [
        { kind: 'transaction', amount: tzToMutez(data.amount, 6).toString(), to: data.recipient, mutez: true }
      ];
      if (tokenSlug) {
        const contract = await from([token.address])
          .pipe(
            withLatestFrom(tezos$),
            switchMap(([address, tezos]) => from(tezos.wallet.at(address)).pipe(map(x => x)))
          )
          .toPromise();
        let transferParams;

        if (token.type === TokenTypeEnum.FA_2) {
          transferParams = contract.methods
            .transfer([
              {
                from_: selectedAccount.publicKeyHash,
                txs: [{ to_: data.recipient, token_id: token.id, amount: tzToMutez(data.amount, token.decimals) }]
              }
            ])
            .toTransferParams();
        } else {
          transferParams = contract.methods
            .transfer(selectedAccount.publicKeyHash, data.recipient, tzToMutez(data.amount, token.decimals))
            .toTransferParams();
        }
        opParams = [
          {
            kind: 'transaction',
            ...transferParams
          }
        ];
      }
      navigate(ModalsEnum.Confirm, {
        type: ConfirmPayloadType.internalOperations,
        networkRpc: MAINNET_NETWORK.rpcBaseURL,
        sourcePkh: data.account.publicKeyHash,
        opParams
      });
    },
    [navigate, token, tokenSlug, selectedAccount.publicKeyHash]
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={SendBottomSheetInitialValues}
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

            <Label label="Amount" description={`Set ${tokenSlug ? token.symbol : 'XTZ'} amount to send.`} />
            <FormNumericInput name="amount" decimals={tokenSlug ? token.decimals : 6} min={0} />
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
