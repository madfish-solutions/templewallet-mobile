// eslint-disable-next-line import/no-named-as-default
import Config from 'react-native-config';

const getEnv = (key: string): string => Config[key] ?? '';

export const READ_ONLY_SIGNER_PUBLIC_KEY = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY');
export const READ_ONLY_SIGNER_PUBLIC_KEY_HASH = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY_HASH');

export const FIREBASE_PROJECT_ID = getEnv('FIREBASE_PROJECT_ID');
export const IOS_APP_ID = getEnv('IOS_APP_ID');
export const ANDROID_APP_ID = getEnv('ANDROID_APP_ID');

export const TEMPLE_WALLET_API = getEnv('TEMPLE_WALLET_API');
