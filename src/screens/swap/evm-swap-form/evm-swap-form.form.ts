import { BigNumber } from 'bignumber.js';
import { mixed, object } from 'yup';

import { assetAmountValidation } from 'src/form/validation/asset-amount';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { EvmSwapAsset } from 'src/types/evm-swap';

export const createEvmSwapFormValidationSchema = (catalog: EvmSwapAsset[]) => {
  const assetValidation = mixed<AssetInterface>().test('selected-asset', 'Asset must be selected', asset =>
    Boolean(asset?.assetSlug && catalog.some(item => item.assetSlug === asset.assetSlug))
  );

  return object().shape({
    inputAssets: assetAmountValidation
      .shape({ asset: assetValidation })
      .test('valid-amount', 'Enter a valid amount', (value, context) => {
        const amount = value.amount;
        if (!(amount instanceof BigNumber) || !amount.gt(0)) return true;

        return (
          (amount.isFinite() && amount.isInteger() && amount.lt(new BigNumber(2).pow(256))) ||
          context.createError({ path: `${context.path}.amount`, message: 'Enter a valid amount' })
        );
      })
      .test('balance', 'Insufficient balance', (value, context) => {
        const asset = catalog.find(item => item.assetSlug === value.asset?.assetSlug);

        return (
          !asset ||
          !(value.amount instanceof BigNumber) ||
          !value.amount.gt(asset.balance) ||
          context.createError({ path: `${context.path}.amount`, message: 'Insufficient balance' })
        );
      }),
    outputAssets: object()
      .shape({ asset: assetValidation })
      .test(
        'different-assets',
        'Select a different token',
        (value, context) =>
          !value.asset?.assetSlug ||
          value.asset.assetSlug !== context.parent.inputAssets?.asset?.assetSlug ||
          context.createError({ path: `${context.path}.asset`, message: 'Select a different token' })
      )
  });
};
