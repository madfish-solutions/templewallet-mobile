import { ToastTypeEnum } from '../enums/toast-type.enum';
import { mockSetString } from '../mocks/react-native-clipboard-clipboard.mock';
import { mockShowToast } from '../mocks/react-native-toast-message.mock';
import { copyStringToClipboard } from './clipboard.utils';

describe('copyStringToClipboard', () => {
  beforeEach(() => {
    mockSetString.mockReset();
    mockShowToast.mockReset();
  });

  it('should do nothing if variable is undefined', () => {
    copyStringToClipboard();
    expect(mockSetString).not.toBeCalled();
    expect(mockShowToast).not.toBeCalled();
  });

  it('should do nothing if variable is empty string', () => {
    copyStringToClipboard('');
    expect(mockSetString).not.toBeCalled();
    expect(mockShowToast).not.toBeCalled();
  });

  it("should change clipboard content and show 'Copied' toast if variable is non-empty string", () => {
    copyStringToClipboard('test');
    expect(mockSetString).toBeCalledWith('test');
    expect(mockShowToast).toBeCalledWith({ type: ToastTypeEnum.Copied });
  });
});
