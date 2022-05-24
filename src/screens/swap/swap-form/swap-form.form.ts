import { object, SchemaOf } from 'yup';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation, assetValidation } from '../../../form/validation/asset-amount';
import { TokenInterface } from '../../../token/interfaces/token.interface';

export const swapFormValidationSchema: SchemaOf<{
  inputAssets: AssetAmountInterface;
  outputAssets: { asset: TokenInterface };
}> = object().shape({
  inputAssets: assetAmountValidation,
  outputAssets: assetValidation
});
