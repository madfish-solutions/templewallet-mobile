export {};

jest.mock('react-native-biometrics', () => {
  return class ReactNativeBiometrics {
    isSensorAvailable() {
      return Promise.resolve({
        biometryType: 'TouchID'
      });
    }
  };
});
