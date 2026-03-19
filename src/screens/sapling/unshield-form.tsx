import { useCallback, useMemo, useState } from 'react';

import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { ZERO } from 'src/utils/number.util';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';

interface UnshieldFormProps {
  saplingToolkit: SaplingToolkit;
  shieldedBalance: BigNumber;
  goToSaplingConfirmation: (amountMutez: BigNumber, txData: string, testID: string) => void;
}

export const UnshieldForm = ({ saplingToolkit, shieldedBalance, goToSaplingConfirmation }: UnshieldFormProps) => {
  const account = useRawCurrentAccountSelector()!;
  const assetToUnshield = useMemo(
    () => ({ ...TEZ_TOKEN_METADATA, balance: shieldedBalance.toFixed(), visibility: VisibilityEnum.Visible }),
    [shieldedBalance]
  );
  const unshieldAmountInputAssetsList = useMemo<TokenInterface[]>(() => [assetToUnshield], [assetToUnshield]);
  const [unshieldInputValue, setUnshieldInputValue] = useState<AssetAmountInterface>({
    asset: assetToUnshield,
    amount: ZERO
  });

  const handleUnshieldPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareUnshieldedTransaction({
        to: account.publicKeyHash,
        amount: unshieldInputValue.amount?.toNumber() ?? 0,
        mutez: true
      });
      goToSaplingConfirmation(ZERO, txData, 'UNSHIELD_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToastByError(e);
    }
  }, [account.publicKeyHash, goToSaplingConfirmation, saplingToolkit, unshieldInputValue.amount]);

  return (
    <>
      <AssetAmountInput
        balance={shieldedBalance.toFixed()}
        value={unshieldInputValue}
        label="Unshield"
        assetsList={unshieldAmountInputAssetsList}
        balanceLabel="Shielded TEZ balance:"
        toUsdToggle={false}
        isSingleAsset={true}
        onValueChange={setUnshieldInputValue}
      />
      <ButtonLargePrimary title="Unshield" onPress={handleUnshieldPress} />
    </>
  );
};
