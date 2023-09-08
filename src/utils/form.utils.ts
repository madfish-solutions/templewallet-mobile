import { RefObject } from 'react';
import { ScrollView } from 'react-native';

interface FormFieldErrors {
  [key: string]: string | undefined;
}
interface FormFieldCoordinateY {
  [key: string]: number;
}

export const scrollToField = (
  refScrollView: RefObject<ScrollView>,
  errors: FormFieldErrors,
  yCoordinates: FormFieldCoordinateY
) => {
  for (const key in yCoordinates) {
    if (Boolean(errors[key])) {
      return refScrollView.current?.scrollTo({
        x: 0,
        y: yCoordinates[key],
        animated: true
      });
    }
  }
};
