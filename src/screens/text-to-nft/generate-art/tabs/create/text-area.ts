import { string } from 'yup';

export const positivePromptValidation = string()
  .max(2000, 'Character limit exceeded')
  .required('Enter a prompt to generate art');

export const negativePromptValidation = string().max(2000, 'Character limit exceeded');
