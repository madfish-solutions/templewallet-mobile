import { useTokensApyInfoSelector } from 'src/store/d-apps/d-apps-selectors';
import { TOKEN_APY_LINKS } from 'src/utils/constants/apy';
import { isDefined } from 'src/utils/is-defined';

export const useTokenApyInfo = (slug: string) => {
  const apyInfo = useTokensApyInfoSelector();

  const rate = apyInfo[slug]?.rate || 0;

  const link = TOKEN_APY_LINKS[slug];

  if (!isDefined(link) && rate === 0) {
    return;
  }

  return {
    rate,
    link
  };
};
