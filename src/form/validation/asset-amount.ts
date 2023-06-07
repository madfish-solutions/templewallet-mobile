import { BigNumber } from 'bignumber.js';
import { object, ValidationError } from 'yup';

import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import { assetValidation } from './asset';
import { bigNumberValidation } from './big-number';
import { makeRequiredErrorMessage } from './messages';

export const assetAmountValidation = object().shape({
  asset: assetValidation,
  amount: bigNumberValidation
    .clone()
    .required(makeRequiredErrorMessage('Amount'))
    .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
      if (value instanceof BigNumber) {
        return value.gt(0);
      }

      return false;
    })
});

export const createAssetAmountWithMaxValidation = (
  gasToken: TokenMetadataInterface,
  expectedGasExpense: BigNumber.Value
) =>
  assetAmountValidation.clone().test('max-amount', (value, context) => {
    const { asset, amount } = value;

    if (!isDefined(asset?.balance) || !isDefined(amount)) {
      return true;
    }

    const gasTokenIsSelected = toTokenSlug(asset.address, asset.id) === toTokenSlug(gasToken.address, gasToken.id);
    const gasAmountCap = gasTokenIsSelected ? tzToMutez(new BigNumber(expectedGasExpense), gasToken.decimals) : 0;
    const maxAmount = BigNumber.max(new BigNumber(asset.balance).minus(gasAmountCap), 0);
    const displayedMaxAmount = formatAssetAmount(mutezToTz(maxAmount, asset.decimals ?? 0));

    return (amount as BigNumber).lte(maxAmount)
      ? true
      : new ValidationError(
          `Maximal amount is ${displayedMaxAmount} ${asset.symbol}`,
          value,
          context.path,
          'max-amount'
        );
  });

export const onlyAssetValidation = object().shape({
  asset: assetValidation
});
