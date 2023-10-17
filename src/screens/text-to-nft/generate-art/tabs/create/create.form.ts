import { object, SchemaOf } from 'yup';

import { positivePromptValidation, negativePromptValidation } from './text-area';

enum ArtStyleEnum {
  PopArt = 'Pop Art',
  Cubist = 'Cubism',
  Impressionism = 'Impressionism',
  Surrealism = 'Surrealism'
}

export interface CreateNftFormValues {
  positivePrompt: string;
  negativePrompt?: string;
  artStyle?: ArtStyleEnum;
}

export const createNftValidationSchema: SchemaOf<Omit<CreateNftFormValues, 'artStyle'>> = object().shape({
  positivePrompt: positivePromptValidation,
  negativePrompt: negativePromptValidation
});

export const createNftInitialValues: CreateNftFormValues = {
  positivePrompt: '',
  negativePrompt: ''
};
