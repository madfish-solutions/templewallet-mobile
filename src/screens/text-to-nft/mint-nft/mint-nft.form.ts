import { object, SchemaOf, string } from 'yup';

import { MintNftFormValues } from './mint-nft.interface';

export const mintNftValidationSchema: SchemaOf<MintNftFormValues> = object().shape({
  title: string()
    .required('Invalid title. It should be: 1-200 characters')
    .max(200, 'The title must be at most 200 characters'),
  description: string()
    .required('Invalid description. It should be: 1-5000 characters')
    .max(5000, 'The description must be at most 5000 characters')
});
