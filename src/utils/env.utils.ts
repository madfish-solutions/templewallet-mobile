// eslint-disable-next-line import/no-named-as-default
import Config from 'react-native-config';

import { version } from '../../package.json';

export const APP_VERSION = version;

const getEnv = (key: string): string => Config[key] ?? '';

export const READ_ONLY_SIGNER_PUBLIC_KEY = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY');
export const READ_ONLY_SIGNER_PUBLIC_KEY_HASH = getEnv('READ_ONLY_SIGNER_PUBLIC_KEY_HASH');

export const JITSU_ANALYTICS_KEY = getEnv('JITSU_ANALYTICS_KEY');
export const JITSU_TRACKING_HOST = getEnv('JITSU_TRACKING_HOST');

export const TEMPLE_WALLET_EXOLIX_API_KEY = getEnv('TEMPLE_WALLET_EXOLIX_API_KEY');

export const TEMPLE_WALLET_EVERSTAKE_API_KEY = getEnv('TEMPLE_WALLET_EVERSTAKE_API_KEY');
export const TEMPLE_WALLET_EVERSTAKE_LINK_ID = getEnv('TEMPLE_WALLET_EVERSTAKE_LINK_ID');

export const TEMPLE_WALLET_UTORG_SID = getEnv('TEMPLE_WALLET_UTORG_SID');

export const TEMPLE_WALLET_API_URL = getEnv('TEMPLE_WALLET_API_URL');
export const TEMPLE_WALLET_STAKING_API_URL = getEnv('TEMPLE_WALLET_STAKING_API_URL');
export const TEZOS_METADATA_API_URL = getEnv('TEZOS_METADATA_API_URL');
export const TEZOS_DEXES_API_URL = getEnv('TEZOS_DEXES_API_URL');

export const TEMPLE_WALLET_ROUTE3_AUTH_TOKEN = getEnv('TEMPLE_WALLET_ROUTE3_AUTH_TOKEN');

export const DYNAMIC_LINKS_DOMAIN_URI_PREFIX = getEnv('DYNAMIC_LINKS_DOMAIN_URI_PREFIX');

export const APK_BUILD_ID = getEnv('APK_BUILD_ID');
