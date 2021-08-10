import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import { ToastTypeEnum } from '../enums/toast-type.enum';
import { copyStringToClipboard } from './clipboard.utils';

describe('copyStringToClipboard', () => {
  const setString = Clipboard.setString as jest.Mock;
  const showToast = Toast.show as jest.Mock;

  beforeEach(() => {
    setString.mockReset();
    showToast.mockReset();
  });

  it('should do nothing if variable is undefined', () => {
    copyStringToClipboard();
    expect(setString).not.toBeCalled();
    expect(showToast).not.toBeCalled();
  });

  it('should do nothing if variable is empty string', () => {
    copyStringToClipboard('');
    expect(setString).not.toBeCalled();
    expect(showToast).not.toBeCalled();
  });

  it("should change clipboard content and show 'Copied' toast if variable is non-empty string", () => {
    copyStringToClipboard('test');
    expect(setString).toBeCalledWith('test');
    expect(showToast).toBeCalledWith({ type: ToastTypeEnum.Copied });
  });
});
