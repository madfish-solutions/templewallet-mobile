import { number, object, SchemaOf, string } from 'yup';

export type SendBottomSheetFormValues = {
  amount: number;
  recipient: string;
};

export const sendBottomSheetValidationSchema: SchemaOf<SendBottomSheetFormValues> = object().shape({
  amount: number().required(),
  recipient: string().required()
});

export const SendBottomSheetInitialValues: SendBottomSheetFormValues = {
  amount: 0,
  recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
};
