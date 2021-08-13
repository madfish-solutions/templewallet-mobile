import { RadioButtonProps } from 'react-native-radio-buttons-group/lib/index';

import { EventFn } from '../config/general';
import { isDefined } from '../utils/is-defined';

interface Props<T extends string> {
  onChange: EventFn<T>;
}

export const useRadioButtonsGroupHook = <T extends string>({ onChange }: Props<T>) => {
  function onPressRadioButton(radioButtonsArray: RadioButtonProps[]) {
    const selectedButton = radioButtonsArray.find(radioButton => radioButton.selected);

    isDefined(selectedButton) && onChange(selectedButton.value as T);
  }

  return { onPressRadioButton };
};
