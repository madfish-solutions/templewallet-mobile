import type { PlatformOSType } from 'react-native';

export const mockDeviceEventEmitterInstance = {
  remove: jest.fn()
};

export const mockDeviceEventEmitter = {
  addListener: jest.fn(() => mockDeviceEventEmitterInstance)
};

export const mockLinking = {
  canOpenURL: jest.fn(() => Promise.resolve()),
  openURL: jest.fn(() => Promise.resolve()),
  addEventListener: jest.fn(() => ({
    remove: jest.fn()
  }))
};

export const mockPlatform = {
  OS: 'android' as const,
  select: jest.fn(platformSelect)
};

function platformSelect<T>(
  specifics: ({ [platform in PlatformOSType]?: T } & { default: T }) | { [platform in PlatformOSType]: T }
): T;
function platformSelect<T>(specifics: { [platform in PlatformOSType]?: T }): T | undefined;
function platformSelect<T>(specifics: { [platform in PlatformOSType | 'default']?: T }) {
  return specifics[mockPlatform.OS] ?? specifics.default;
}

jest.mock('react-native', () => ({
  DeviceEventEmitter: mockDeviceEventEmitter,
  Linking: mockLinking,
  Platform: mockPlatform
}));
