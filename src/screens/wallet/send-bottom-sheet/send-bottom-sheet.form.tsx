import { object, SchemaOf, string } from 'yup';

export type SendBottomSheetFormValues = {
  amount: string;
  recipient: string;
};

export const sendBottomSheetValidationSchema: SchemaOf<SendBottomSheetFormValues> = object().shape({
  amount: string().required(),
  recipient: string().required()
});

export const SendBottomSheetInitialValues: SendBottomSheetFormValues = {
  amount: '0',
  recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
};
