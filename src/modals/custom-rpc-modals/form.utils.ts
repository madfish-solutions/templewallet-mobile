import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { urlValidation } from 'src/form/validation/url';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { showErrorToast } from 'src/toast/toast.utils';

interface FormValues {
  name: string;
  url: string;
}

export const formInitialValues: FormValues = {
  name: '',
  url: ''
};

export const formValidationSchema: SchemaOf<FormValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name')),
  url: urlValidation
});

export const confirmUniqueRPC = (list: RpcInterface[], item: RpcInterface): boolean => {
  const duplicate = list.find(rpc => rpc.name === item.name || rpc.url === item.url);

  if (duplicate) {
    showErrorToast({ description: `RPC already exists ${duplicate.name}(${duplicate.url})` });

    return false;
  }

  return true;
};
