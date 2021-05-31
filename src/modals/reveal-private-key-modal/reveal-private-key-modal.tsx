import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';

import { emptyFn } from '../../config/general';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { RevealPrivateKeyFormContent } from './reveal-private-key-form-content/reveal-private-key-form-content';
import {
  RevealPrivateKeyModalFormValues,
  revealPrivateKeyModalValidationSchema
} from './reveal-private-key-modal.form';

export const RevealPrivateKeyModal = () => {
  const account = useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealPrivateKey>>().params.account;

  const RevealPrivateKeyModalInitialValues: RevealPrivateKeyModalFormValues = { account, privateKey: '' };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealPrivateKeyModalValidationSchema}
      onSubmit={emptyFn}>
      {RevealPrivateKeyFormContent}
    </Formik>
  );
};
