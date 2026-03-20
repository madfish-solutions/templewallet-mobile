import { object, SchemaOf } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { assetAmountValidation, onlyAssetValidation } from 'src/form/validation/asset-amount';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const swapFormValidationSchema: SchemaOf<{
  inputAssets: AssetAmountInterface;
  outputAssets: { asset: TokenInterface };
}> = object().shape({
  inputAssets: assetAmountValidation,
  outputAssets: onlyAssetValidation
});
