import { isEqual } from 'lodash-es';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';

export const useAccountCollectibles = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemoWithCompare(
    () =>
      collectibles.stored.reduce<AccountTokenInterface[]>((acc, curr) => {
        if (collectibles.removed.indexOf(curr.slug) > -1) {
          return acc;
        }

        const visibility =
          curr.visibility === VisibilityEnum.InitiallyHidden && Number(curr.balance) > 0
            ? VisibilityEnum.Visible
            : curr.visibility;

        return acc.concat({
          ...curr,
          visibility
        });
      }, []) ?? [],
    [collectibles],
    isEqual
  );
};
