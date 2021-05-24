import { number } from 'yup';

export const tokenIdValidation = number().required().moreThan(-1);
