import { renderHook } from '@testing-library/react-hooks';

import { mockHdAccount } from '../interfaces/account.interface.mock';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';
import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { mockGoBack, mockNavigate } from '../mocks/react-navigation.mock';
import { mockUseDispatch } from '../mocks/react-redux.mock';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { mockRootState } from '../store/root-state.mock';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { mockShowErrorToast, mockShowSuccessToast } from '../toast/toast.utils.mock';
import { mockRevealedSecretKey, mockRevealedSeedPhrase, mockShelter } from './shelter.mock';
import { useShelter } from './use-shelter.hook';

describe('useShelter', () => {
  const mockSuccessCallback = jest.fn();

  beforeEach(() => {
    mockShelter.importHdAccount$.mockClear();
    mockShelter.enableBiometryPassword$.mockClear();
    mockShelter.createHdAccount$.mockClear();
    mockShelter.revealSecretKey$.mockClear();
    mockShelter.revealSeedPhrase$.mockClear();
    mockShelter.createImportedAccount$.mockClear();
    mockUseDispatch.mockClear();
    mockGoBack.mockClear();
    mockNavigate.mockClear();
    mockShowErrorToast.mockClear();
    mockShowSuccessToast.mockClear();
  });

  it('should import wallet', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet(mockAccountCredentials.seedPhrase, mockCorrectPassword);

    expect(mockShelter.importHdAccount$).toBeCalledWith(mockAccountCredentials.seedPhrase, mockCorrectPassword);
    expect(mockShelter.enableBiometryPassword$).not.toBeCalled();

    expect(mockUseDispatch).toBeCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toBeCalledWith(addHdAccountAction(mockHdAccount));
  });

  it('should import wallet and enable biometry password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet(mockAccountCredentials.seedPhrase, mockCorrectPassword, true);

    expect(mockShelter.importHdAccount$).toBeCalledWith(mockAccountCredentials.seedPhrase, mockCorrectPassword);
    expect(mockShelter.enableBiometryPassword$).toBeCalledWith(mockCorrectPassword);
  });

  it('should create HD account', () => {
    const { result } = renderHook(() => useShelter());

    result.current.createHdAccount({ name: mockHdAccount.name });

    expect(mockShelter.createHdAccount$).toBeCalledWith(mockHdAccount.name, mockRootState.wallet.accounts.length);

    expect(mockUseDispatch).toBeCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toBeCalledWith(addHdAccountAction(mockHdAccount));
    expect(mockGoBack).toBeCalled();
  });

  it('should reveal secret key', () => {
    const { result } = renderHook(() => useShelter());

    result.current.revealSecretKey({
      publicKeyHash: mockAccountCredentials.publicKeyHash,
      successCallback: mockSuccessCallback
    });

    expect(mockShelter.revealSecretKey$).toBeCalledWith(mockAccountCredentials.publicKeyHash);
    expect(mockSuccessCallback).toBeCalledWith(mockRevealedSecretKey);
  });

  it('should reveal seed phrase', () => {
    const { result } = renderHook(() => useShelter());

    result.current.revealSeedPhrase({
      successCallback: mockSuccessCallback
    });

    expect(mockShelter.revealSeedPhrase$).toBeCalled();
    expect(mockSuccessCallback).toBeCalledWith(mockRevealedSeedPhrase);
  });

  it('should enable biometry password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.enableBiometryPassword(mockCorrectPassword);

    expect(mockShelter.enableBiometryPassword$).toBeCalledWith(mockCorrectPassword);

    expect(mockShowSuccessToast).toBeCalledWith({ description: 'Successfully enabled!' });
    expect(mockUseDispatch).toBeCalledWith(setIsBiometricsEnabled(true));
    expect(mockNavigate).toBeCalledWith(StacksEnum.MainStack);
  });

  it('should not enable biometry password for incorrect password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.enableBiometryPassword('mockIncorrectPassword');

    expect(mockShowErrorToast).toBeCalledWith({ description: 'Wrong password, please, try again' });
    expect(mockShelter.enableBiometryPassword$).not.toBeCalled();
  });

  it('should create imported account', () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedAccount({ privateKey: mockAccountCredentials.privateKey, name: mockHdAccount.name });

    expect(mockShelter.createImportedAccount$).toBeCalledWith(mockAccountCredentials.privateKey, mockHdAccount.name);

    expect(mockUseDispatch).toBeCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toBeCalledWith(addHdAccountAction(mockHdAccount));
    expect(mockShowSuccessToast).toBeCalledWith({ description: 'Account Imported!' });
    expect(mockGoBack).toBeCalled();
  });
});
