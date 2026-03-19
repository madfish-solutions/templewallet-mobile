import { useCallback, useMemo, useState } from 'react';

import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useCurrentAccountTezosBalance } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { ZERO } from 'src/utils/number.util';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';

interface ShieldFormProps {
  saplingToolkit: SaplingToolkit;
  saplingAddress: string;
  goToSaplingConfirmation: (amountMutez: BigNumber, txData: string, testID: string) => void;
}

export const ShieldForm = ({ saplingToolkit, saplingAddress, goToSaplingConfirmation }: ShieldFormProps) => {
  const rawUnshieldedBalance = useCurrentAccountTezosBalance();
  const assetToShield = useMemo(
    () => ({ ...TEZ_TOKEN_METADATA, balance: rawUnshieldedBalance, visibility: VisibilityEnum.Visible }),
    [rawUnshieldedBalance]
  );
  const shieldAmountInputAssetsList = useMemo<TokenInterface[]>(() => [assetToShield], [assetToShield]);

  const [shieldInputValue, setShieldInputValue] = useState<AssetAmountInterface>({
    asset: assetToShield,
    amount: ZERO
  });

  const handleShieldPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareShieldedTransaction([
        { to: saplingAddress, amount: shieldInputValue.amount?.toNumber() ?? 0, mutez: true }
      ]);
      goToSaplingConfirmation(shieldInputValue.amount ?? ZERO, txData, 'SHIELD_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToastByError(e);
    }
  }, [goToSaplingConfirmation, saplingAddress, saplingToolkit, shieldInputValue.amount]);

  return (
    <>
      <AssetAmountInput
        value={shieldInputValue}
        label="Shield"
        assetsList={shieldAmountInputAssetsList}
        balanceLabel="TEZ balance:"
        toUsdToggle={false}
        isSingleAsset={true}
        onValueChange={setShieldInputValue}
      />
      <ButtonLargePrimary title="Shield" onPress={handleShieldPress} />
    </>
  );
};
