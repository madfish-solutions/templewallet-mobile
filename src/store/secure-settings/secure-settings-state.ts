export interface SecureSettingsState {
  biometricsEnabled: boolean;
}

export const secureSettingsInitialState: SecureSettingsState = {
  biometricsEnabled: false
};

export interface SecureSettingsRootState {
  secureSettings: SecureSettingsState;
}
