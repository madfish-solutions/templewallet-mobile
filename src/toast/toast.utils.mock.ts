export const mockShowErrorToast = jest.fn();
export const mockShowSuccessToast = jest.fn();
export const mockShowWarningToast = jest.fn();
export const mockShowCopiedToast = jest.fn();

jest.mock('./toast.utils', () => ({
  showErrorToast: mockShowErrorToast,
  showSuccessToast: mockShowSuccessToast,
  showWarningToast: mockShowWarningToast,
  showCopiedToast: mockShowCopiedToast
}));
