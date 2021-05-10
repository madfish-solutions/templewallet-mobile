import { FieldMetaProps } from 'formik';

export function hasError<T>(meta: FieldMetaProps<T>): boolean {
  return meta.touched && meta.error !== undefined;
}
