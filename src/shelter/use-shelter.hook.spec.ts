import { renderHook } from '@testing-library/react-hooks';

import { mockHdAccount } from '../interfaces/account.interface.mock';
import { mockAccountCredentials, mockInvalidPrivateKey } from '../mocks/account-credentials.mock';
import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { mockNavigationDispatch, mockNavigate } from '../mocks/react-navigation.mock';
import { mockUseDispatch } from '../mocks/react-redux.mock';
import { mockInMemorySigner } from '../mocks/taquito-signer.mock';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { mockRootState } from '../store/root-state.mock';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { addHdAccountAction, setSelectedAccountAction } from '../store/wallet/wallet-actions';
import { mockShowErrorToast, mockShowSuccessToast, mockShowWarningToast } from '../toast/toast.utils.mock';

import { mockRevealedSecretKey, mockRevealedSeedPhrase, mockShelter } from './shelter.mock';
import { useShelter } from './use-shelter.hook';

describe('useShelter', () => {
  jest.useFakeTimers();
  afterAll(() => void jest.useRealTimers());

  const mockSuccessCallback = jest.fn();

  beforeEach(() => {
    mockShelter.importHdAccount$.mockClear();
    mockShelter.enableBiometryPassword$.mockClear();
    mockShelter.createHdAccount$.mockClear();
    mockShelter.revealSecretKey$.mockClear();
    mockShelter.revealSeedPhrase$.mockClear();
    mockShelter.createImportedAccount$.mockClear();
    mockUseDispatch.mockClear();
    mockNavigationDispatch.mockClear();
    mockNavigate.mockClear();
    mockShowErrorToast.mockClear();
    mockShowSuccessToast.mockClear();
    mockShowWarningToast.mockClear();
  });

  it('should import wallet', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet({ seedPhrase: mockAccountCredentials.seedPhrase, password: mockCorrectPassword });

    expect(mockShelter.importHdAccount$).toHaveBeenCalledWith(
      mockAccountCredentials.seedPhrase,
      mockCorrectPassword,
      undefined
    );
    expect(mockShelter.enableBiometryPassword$).not.toHaveBeenCalled();

    expect(mockUseDispatch).toHaveBeenCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toHaveBeenCalledWith(addHdAccountAction(mockHdAccount));
  });

  it('should import wallet and enable biometry password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet({
      seedPhrase: mockAccountCredentials.seedPhrase,
      password: mockCorrectPassword,
      useBiometry: true
    });

    expect(mockShelter.importHdAccount$).toHaveBeenCalledWith(
      mockAccountCredentials.seedPhrase,
      mockCorrectPassword,
      undefined
    );
    expect(mockShelter.enableBiometryPassword$).toHaveBeenCalledWith(mockCorrectPassword);
  });

  it('should create HD account', () => {
    const { result } = renderHook(() => useShelter());

    result.current.createHdAccount();

    expect(mockShelter.createHdAccount$).toHaveBeenCalledWith(
      `Account ${mockRootState.wallet.accounts.length + 1}`,
      mockRootState.wallet.accounts.length
    );

    expect(mockUseDispatch).toHaveBeenCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toHaveBeenCalledWith(addHdAccountAction(mockHdAccount));
  });

  it('should reveal secret key', () => {
    const { result } = renderHook(() => useShelter());

    result.current.revealSecretKey({
      publicKeyHash: mockAccountCredentials.publicKeyHash,
      successCallback: mockSuccessCallback
    });

    expect(mockShelter.revealSecretKey$).toHaveBeenCalledWith(mockAccountCredentials.publicKeyHash);
    expect(mockSuccessCallback).toHaveBeenCalledWith(mockRevealedSecretKey);
  });

  it('should reveal seed phrase', () => {
    const { result } = renderHook(() => useShelter());

    result.current.revealSeedPhrase({
      successCallback: mockSuccessCallback
    });

    expect(mockShelter.revealSeedPhrase$).toHaveBeenCalled();
    expect(mockSuccessCallback).toHaveBeenCalledWith(mockRevealedSeedPhrase);
  });

  it('should enable biometry password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.enableBiometryPassword(mockCorrectPassword);

    expect(mockShelter.enableBiometryPassword$).toHaveBeenCalledWith(mockCorrectPassword);

    expect(mockShowSuccessToast).toHaveBeenCalledWith({ description: 'Successfully enabled!' });
    expect(mockUseDispatch).toHaveBeenCalledWith(setIsBiometricsEnabled(true));
    expect(mockNavigate).toHaveBeenCalledWith(StacksEnum.MainStack);
  });

  it('should not enable biometry password for incorrect password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.enableBiometryPassword('mockIncorrectPassword');

    expect(mockShowErrorToast).toHaveBeenCalledWith({ description: 'Wrong password, please, try again' });
    expect(mockShelter.enableBiometryPassword$).not.toHaveBeenCalled();
  });

  it('should create imported account', async () => {
    mockInMemorySigner.publicKey.mockReturnValueOnce(Promise.resolve('another public key'));
    const { result } = renderHook(() => useShelter());

    result.current.createImportedAccount({ privateKey: mockAccountCredentials.privateKey, name: mockHdAccount.name });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedAccount$).toHaveBeenCalledWith(
      mockAccountCredentials.privateKey,
      mockHdAccount.name
    );

    expect(mockUseDispatch).toHaveBeenCalledWith(setSelectedAccountAction(mockHdAccount.publicKeyHash));
    expect(mockUseDispatch).toHaveBeenCalledWith(addHdAccountAction(mockHdAccount));
    expect(mockShowSuccessToast).toHaveBeenCalledWith({ description: 'Account Imported!' });
    expect(mockNavigationDispatch).toHaveBeenCalledWith({ type: 'POP_TO_TOP' });
  });

  it('should not create account with invalid private key', async () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedAccount({ privateKey: mockInvalidPrivateKey, name: mockHdAccount.name });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedAccount$).not.toHaveBeenCalled();

    expect(mockShowErrorToast).toHaveBeenCalledWith({
      title: 'Failed to import account.',
      description: 'This may happen because provided Key is invalid.'
    });
  });

  it('should show error toast while creating the same account', async () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedAccount({ privateKey: mockAccountCredentials.privateKey, name: mockHdAccount.name });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedAccount$).not.toHaveBeenCalled();

    expect(mockShowWarningToast).toHaveBeenCalledWith({ description: 'Account already exist' });
  });
});
