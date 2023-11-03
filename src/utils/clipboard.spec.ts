import { ToastTypeEnum } from '../enums/toast-type.enum';
import { mockReactNativeClipboard } from '../mocks/react-native-clipboard-clipboard.mock';
import { mockReactNativeToastMessage } from '../mocks/react-native-toast-message.mock';

import { copyStringToClipboard } from './clipboard.utils';

describe('copyStringToClipboard', () => {
  beforeEach(() => {
    mockReactNativeClipboard.setString.mockReset();
    mockReactNativeToastMessage.show.mockReset();
  });

  it('should do nothing if variable is undefined', () => {
    copyStringToClipboard();
    expect(mockReactNativeClipboard.setString).not.toBeCalled();
    expect(mockReactNativeToastMessage.show).not.toBeCalled();
  });

  it('should do nothing if variable is empty string', () => {
    copyStringToClipboard('');
    expect(mockReactNativeClipboard.setString).not.toBeCalled();
    expect(mockReactNativeToastMessage.show).not.toBeCalled();
  });

  it("should change clipboard content and show 'Copied' toast if variable is non-empty string", () => {
    copyStringToClipboard('test');
    expect(mockReactNativeClipboard.setString).toBeCalledWith('test');
    expect(mockReactNativeToastMessage.show).toBeCalledWith({ type: ToastTypeEnum.Copied });
  });
});
