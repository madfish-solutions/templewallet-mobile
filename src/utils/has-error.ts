import { FieldMetaProps } from 'formik';

export const hasError = <T>(meta: FieldMetaProps<T>): boolean => meta.touched && meta.error !== undefined;
