import { YUPANA_LINK, KORDFI_LINK } from 'src/utils/constants/apy';

export const apyLinkSelectors: Record<string, string> = {
  [YUPANA_LINK]: 'TokenPage/Yupana/Apy',
  [KORDFI_LINK]: 'TokenPage/Kordfi/Apy'
};
