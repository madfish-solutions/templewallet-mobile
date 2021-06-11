import { RouteProp, useRoute } from '@react-navigation/core';
import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { from, of, Subject } from 'rxjs';
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
import { ConfirmPayloadTypeEnum } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { InternalOperationsPayload } from '../../interfaces/confirm-payload/internal-operations-payload.interface';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { tezos$ } from '../../utils/network/network.util';
import { tzToMutez } from '../../utils/tezos.util';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const { asset } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;
  const { goBack, navigate } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const sendModalInitialValues: SendModalFormValues = {
    account: selectedAccount,
    amount: new BigNumber(0),
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
  };

  const onSubmit$ = useMemo(() => new Subject<SendModalFormValues>(), []);

  useEffect(() => {
    onSubmit$
      .pipe(
        withLatestFrom(tezos$),
        switchMap(([data, tezos]) => {
          const { id, address, decimals } = asset;

          return isDefined(address)
            ? from(tezos.wallet.at(address)).pipe(
                switchMap(contract => {
                  const transferParamsObserver = isDefined(id)
                    ? of(
                        contract.methods
                          .transfer([
                            {
                              from_: selectedAccount.publicKeyHash,
                              txs: [
                                {
                                  to_: data.recipient,
                                  token_id: id,
                                  amount: tzToMutez(data.amount, decimals).toString()
                                }
                              ]
                            }
                          ])
                          .toTransferParams()
                      )
                    : of(
                        contract.methods
                          .transfer(
                            selectedAccount.publicKeyHash,
                            data.recipient,
                            tzToMutez(data.amount, decimals).toString()
                          )
                          .toTransferParams()
                      );

                  return transferParamsObserver.pipe(
                    map((transferParams): [SendModalFormValues, InternalOperationsPayload['operationsParams']] => [
                      data,
                      [
                        {
                          kind: OpKind.TRANSACTION,
                          ...transferParams
                        }
                      ]
                    ])
                  );
                })
              )
            : of<[SendModalFormValues, InternalOperationsPayload['operationsParams']]>([
                data,
                [
                  {
                    kind: OpKind.TRANSACTION,
                    amount: tzToMutez(data.amount, decimals).toString(),
                    to: data.recipient,
                    mutez: true
                  }
                ]
              ]);
        })
      )
      .subscribe(([data, operationsParams]) => {
        navigate(ModalsEnum.Confirm, {
          type: ConfirmPayloadTypeEnum.InternalOperations,
          sourcePublicKeyHash: data.account.publicKeyHash,
          operationsParams
        });
      });

    return () => {
      onSubmit$.unsubscribe();
    };
  }, [asset, navigate, onSubmit$, selectedAccount.publicKeyHash]);
  // TODO: integrate gasFee with send request
  const onSubmit = (data: SendModalFormValues) => onSubmit$.next(data);

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
