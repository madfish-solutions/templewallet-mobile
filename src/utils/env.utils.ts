// eslint-disable-next-line import/no-named-as-default
import Config from 'react-native-config';

export const getEnv = (key: string): string => Config[key] ?? '';
