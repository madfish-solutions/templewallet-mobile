// eslint-disable-next-line import/no-named-as-default
import Config from 'react-native-config';

const getEnv = (key: string): string => Config[key] ?? '';

export const READ_ONLY_SIGNER_PUBLIC_KEY = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY');
export const READ_ONLY_SIGNER_PUBLIC_KEY_HASH = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY_HASH');

export const TEMPLE_WALLET_API = getEnv('TEMPLE_WALLET_API');
export const SEGMENT_ANALYTICS_KEY = getEnv('SEGMENT_ANALYTICS_KEY');
