import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { of } from 'rxjs';

import { dispatch as storeDispatch } from 'src/store';

import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockEvmImportedAccount, mockHdAccount, mockNewHdAccount } from '../interfaces/account.interface.mock';
import { mockAccountCredentials, mockInvalidPrivateKey } from '../mocks/account-credentials.mock';
import { mockCorrectPassword } from '../mocks/react-native-keychain.mock';
import { mockNavigate, mockNavigationDispatch } from '../mocks/react-navigation.mock';
import { mockInMemorySigner } from '../mocks/taquito-signer.mock';
import { StacksEnum } from '../navigator/enums/stacks.enum';
import { navigateAction } from '../store/root-state.actions';
import { mockRootState } from '../store/root-state.mock';
import { setIsBiometricsEnabled } from '../store/settings/settings-actions';
import { loadWhitelistAction } from '../store/tokens-metadata/tokens-metadata-actions';
import { addAccountAction, setSelectedAccountIdAction } from '../store/wallet/wallet-actions';
import { mockShowErrorToast, mockShowSuccessToast, mockShowWarningToast } from '../toast/toast.utils.mock';
import * as tokenBalanceUtils from '../utils/token-balance.utils';

import { mockRevealedSecretKey, mockRevealedSeedPhrase, mockShelter } from './shelter.mock';
import { useShelter } from './use-shelter.hook';

jest.mock('src/store', () => ({
  dispatch: jest.fn()
}));

const mockStoreDispatch = storeDispatch as jest.Mock;

describe('useShelter', () => {
  jest.useFakeTimers();
  afterAll(() => void jest.useRealTimers());

  const mockSuccessCallback = jest.fn();
  const mockEvmPrivateKey = '0xec90061805584475c77bc57b9cf5a918f279dc4cddf365820dae472348bf405b';
  let loadTezosBalanceSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation(selector => selector(mockRootState));

    loadTezosBalanceSpy = jest.spyOn(tokenBalanceUtils, 'loadTezosBalance$').mockReturnValue(of('0'));
    mockShelter.importWallet$.mockClear();
    mockShelter.enableBiometryPassword$.mockClear();
    mockShelter.createHdAccount$.mockClear();
    mockShelter.revealAccountPrivateKey$.mockClear();
    mockShelter.revealSeedPhrase$.mockClear();
    mockShelter.createImportedChainAccount$.mockClear();
    mockShelter.createImportedMultichainAccount$.mockClear();
    mockShelter.saveSaplingSpendingKey$.mockClear();
    mockStoreDispatch.mockClear();
    mockNavigationDispatch.mockClear();
    mockNavigate.mockClear();
    mockShowErrorToast.mockClear();
    mockShowSuccessToast.mockClear();
    mockShowWarningToast.mockClear();
  });

  it('should import wallet', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet({ seedPhrase: mockAccountCredentials.seedPhrase, password: mockCorrectPassword });

    expect(mockShelter.importWallet$).toHaveBeenCalledWith(
      mockAccountCredentials.seedPhrase,
      mockCorrectPassword,
      undefined
    );
    expect(mockShelter.enableBiometryPassword$).not.toHaveBeenCalled();

    expect(mockStoreDispatch).toHaveBeenCalledWith(setSelectedAccountIdAction(mockHdAccount.id));
    expect(mockStoreDispatch).toHaveBeenCalledWith(addAccountAction(mockHdAccount));
  });

  it('should import wallet and enable biometry password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.importWallet({
      seedPhrase: mockAccountCredentials.seedPhrase,
      password: mockCorrectPassword,
      useBiometry: true
    });

    expect(mockShelter.importWallet$).toHaveBeenCalledWith(
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
      mockRootState.wallet.accounts.length,
      mockRootState.wallet.accounts
    );

    expect(mockStoreDispatch).toHaveBeenCalledWith(setSelectedAccountIdAction(mockNewHdAccount.id));
    expect(mockStoreDispatch).toHaveBeenCalledWith(addAccountAction(mockNewHdAccount));
  });

  it('should reveal secret key', () => {
    const { result } = renderHook(() => useShelter());

    result.current.revealSecretKey({
      address: mockAccountCredentials.publicKeyHash,
      successCallback: mockSuccessCallback
    });

    expect(mockShelter.revealAccountPrivateKey$).toHaveBeenCalledWith(mockAccountCredentials.publicKeyHash);
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
    expect(mockStoreDispatch).toHaveBeenCalledWith(setIsBiometricsEnabled(true));
    expect(mockStoreDispatch).toHaveBeenCalledWith(navigateAction({ screen: StacksEnum.MainStack }));
  });

  it('should not enable biometry password for incorrect password', () => {
    const { result } = renderHook(() => useShelter());

    result.current.enableBiometryPassword('mockIncorrectPassword');

    expect(mockShowErrorToast).toHaveBeenCalledWith({ description: 'Wrong password, please, try again' });
    expect(mockShelter.enableBiometryPassword$).not.toHaveBeenCalled();
  });

  it('should create imported account', async () => {
    mockInMemorySigner.publicKey.mockReturnValueOnce(Promise.resolve('another public key'));
    mockInMemorySigner.publicKeyHash.mockReturnValueOnce(Promise.resolve('tz1AnotherPublicKeyHash'));
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromPrivateKey({
      privateKey: mockAccountCredentials.privateKey,
      name: mockHdAccount.name,
      chain: TempleChainKind.Tezos
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).toHaveBeenCalledWith(
      mockAccountCredentials.privateKey,
      mockHdAccount.name,
      TempleChainKind.Tezos
    );

    expect(mockStoreDispatch).toHaveBeenCalledWith(setSelectedAccountIdAction(mockHdAccount.id));
    expect(mockStoreDispatch).toHaveBeenCalledWith(addAccountAction(mockHdAccount));
    expect(mockShowSuccessToast).toHaveBeenCalledWith({ description: 'Account Imported!' });
    expect(mockNavigationDispatch).toHaveBeenCalledWith({ type: 'POP_TO_TOP' });
  });

  it('should create imported EVM account', async () => {
    mockShelter.createImportedChainAccount$.mockReturnValueOnce(of(mockEvmImportedAccount));
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromPrivateKey({
      privateKey: mockEvmPrivateKey,
      name: mockEvmImportedAccount.name,
      chain: mockEvmImportedAccount.chain
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).toHaveBeenCalledWith(
      mockEvmPrivateKey,
      mockEvmImportedAccount.name,
      TempleChainKind.EVM
    );
    expect(mockShelter.saveSaplingSpendingKey$).not.toHaveBeenCalled();
    expect(loadTezosBalanceSpy).not.toHaveBeenCalled();
    expect(mockStoreDispatch).toHaveBeenCalledWith(setSelectedAccountIdAction(mockEvmImportedAccount.id));
    expect(mockStoreDispatch).toHaveBeenCalledWith(addAccountAction(mockEvmImportedAccount));
    expect(mockStoreDispatch).not.toHaveBeenCalledWith(loadWhitelistAction.submit());
  });

  it('should create imported multichain account from seed without custom derivation path', async () => {
    const initialAccounts = mockRootState.wallet.accounts;
    mockRootState.wallet.accounts = [];
    try {
      const { result } = renderHook(() => useShelter());

      result.current.createImportedMultichainAccountFromSeed({
        seedPhrase: mockAccountCredentials.seedPhrase,
        name: mockHdAccount.name
      });
      await jest.runAllTimersAsync();
    } finally {
      mockRootState.wallet.accounts = initialAccounts;
    }

    expect(mockShelter.createImportedMultichainAccount$).toHaveBeenCalledWith(
      mockAccountCredentials.seedPhrase,
      mockHdAccount.name
    );
    expect(mockShelter.createImportedChainAccount$).not.toHaveBeenCalled();
  });

  it('should create imported EVM chain account from seed with custom EVM derivation path', async () => {
    mockShelter.createImportedChainAccount$.mockReturnValueOnce(of(mockEvmImportedAccount));
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromSeed({
      seedPhrase: mockAccountCredentials.seedPhrase,
      name: mockEvmImportedAccount.name,
      derivationPath: "m/44'/60'/0'/0/1"
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).toHaveBeenCalledWith(
      expect.any(String),
      mockEvmImportedAccount.name,
      TempleChainKind.EVM
    );
    expect(mockShelter.createImportedMultichainAccount$).not.toHaveBeenCalled();
  });

  it('should create imported Tezos chain account from seed with custom non-EVM derivation path', async () => {
    mockInMemorySigner.publicKey.mockReturnValueOnce(Promise.resolve('another public key'));
    mockInMemorySigner.publicKeyHash.mockReturnValueOnce(Promise.resolve('tz1AnotherPublicKeyHash'));
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromSeed({
      seedPhrase: mockAccountCredentials.seedPhrase,
      name: mockHdAccount.name,
      derivationPath: "m/44'/999'/0'/0'"
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).toHaveBeenCalledWith(
      expect.any(String),
      mockHdAccount.name,
      TempleChainKind.Tezos
    );
    expect(mockShelter.createImportedMultichainAccount$).not.toHaveBeenCalled();
  });

  it('should not create account with invalid private key', async () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromPrivateKey({
      privateKey: mockInvalidPrivateKey,
      name: mockHdAccount.name,
      chain: TempleChainKind.Tezos
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).not.toHaveBeenCalled();

    expect(mockShowErrorToast).toHaveBeenCalledWith({
      title: 'Failed to import account.',
      description: 'This may happen because provided Key is invalid.'
    });
  });

  it('should show error toast while creating the same account', async () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromPrivateKey({
      privateKey: mockAccountCredentials.privateKey,
      name: mockHdAccount.name,
      chain: TempleChainKind.Tezos
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).not.toHaveBeenCalled();

    expect(mockShowWarningToast).toHaveBeenCalledWith({ description: 'Account already exist' });
  });

  it('should show error toast while creating the same EVM account', async () => {
    const { result } = renderHook(() => useShelter());

    result.current.createImportedChainAccountFromPrivateKey({
      privateKey: '0x3925ef64b24414526bd9d28826c642a34d4d8fbb292b467a33f5376126632d3d',
      name: mockEvmImportedAccount.name,
      chain: TempleChainKind.EVM
    });
    await jest.runAllTimersAsync();

    expect(mockShelter.createImportedChainAccount$).not.toHaveBeenCalled();

    expect(mockShowWarningToast).toHaveBeenCalledWith({ description: 'Account already exist' });
  });
});
