import { YUPANA_LINK, KORDFI_LINK } from '../../store/d-apps/constants';

export const apyLinkSelectors: Record<string, string> = {
  [YUPANA_LINK]: 'TokenPage/Yupana/Apy',
  [KORDFI_LINK]: 'TokenPage/Kordfi/Apy'
};
