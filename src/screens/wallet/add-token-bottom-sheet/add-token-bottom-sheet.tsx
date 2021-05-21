import { Formik } from 'formik';
import React, { FC, useState } from 'react';

import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { TokenTypeEnum } from '../../../interfaces/token-type.enum';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';
import { addTokenFormInitialValues, addTokenFormValidationSchema, AddTokenFormValues } from './add-token.form';

export const AddTokenBottomSheet: FC<BottomSheetControllerProps> = ({ controller }) => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const onSubmit = (data: AddTokenFormValues) => console.log('add token');

  return (
    <ModalBottomSheet title="Add Token" controller={controller}>
      <Formik
        initialValues={addTokenFormInitialValues}
        validationSchema={addTokenFormValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm, isValid }) => (
          <>
            {innerScreenIndex === 0 && <AddTokenAddress onFormSubmitted={() => setInnerScreenIndex(1)} />}
            {innerScreenIndex === 1 && (
              <AddTokenInfo
                isValid={isValid}
                onCancelButtonPress={() => setInnerScreenIndex(0)}
                onConfirmButtonPress={submitForm}
              />
            )}
          </>
        )}
      </Formik>
    </ModalBottomSheet>
  );
};
