import { object, SchemaOf, string } from 'yup';

export type ApprovePasswordModalFormValues = {
  password: string;
};

export const approvePasswordModalValidationSchema: SchemaOf<ApprovePasswordModalFormValues> = object().shape({
  password: string().required()
});
