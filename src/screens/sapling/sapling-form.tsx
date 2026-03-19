import { useCallback, useMemo, useState } from 'react';

import { AddressInput } from 'src/components/address-input/address-input';
import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { ZERO } from 'src/utils/number.util';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';

interface SaplingFormProps {
  saplingToolkit: SaplingToolkit;
  shieldedBalance: BigNumber;
  goToSaplingConfirmation: (amountMutez: BigNumber, txData: string, testID: string) => void;
}

export const SaplingForm = ({ saplingToolkit, goToSaplingConfirmation, shieldedBalance }: SaplingFormProps) => {
  const assetToSend = useMemo(
    () => ({ ...TEZ_TOKEN_METADATA, balance: shieldedBalance.toFixed(), visibility: VisibilityEnum.Visible }),
    [shieldedBalance]
  );
  const saplingAmountInputAssetsList = useMemo<TokenInterface[]>(() => [assetToSend], [assetToSend]);
  const [saplingInputValue, setSaplingInputValue] = useState<AssetAmountInterface>({
    asset: assetToSend,
    amount: ZERO
  });
  const [saplingDestinationAddress, setSaplingDestinationAddress] = useState<string>('');

  const handleSaplingTxPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareSaplingTransaction([
        { to: saplingDestinationAddress, amount: saplingInputValue.amount?.toNumber() ?? 0, mutez: true }
      ]);
      goToSaplingConfirmation(ZERO, txData, 'SAPLING_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToastByError(e);
    }
  }, [goToSaplingConfirmation, saplingDestinationAddress, saplingToolkit, saplingInputValue.amount]);

  return (
    <>
      <AssetAmountInput
        balance={shieldedBalance.toFixed()}
        value={saplingInputValue}
        label="Sapling"
        assetsList={saplingAmountInputAssetsList}
        balanceLabel="Shielded TEZ balance:"
        toUsdToggle={false}
        isSingleAsset={true}
        onValueChange={setSaplingInputValue}
      />
      <AddressInput
        value={saplingDestinationAddress}
        placeholder="Destination address"
        onChangeText={setSaplingDestinationAddress}
      />
      <ButtonLargePrimary title="Sapling" onPress={handleSaplingTxPress} />
    </>
  );
};
