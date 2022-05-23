import { object, SchemaOf } from 'yup';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation } from '../../../form/validation/asset-amount';

export const swapFormValidationSchema: SchemaOf<{
  inputAssets: AssetAmountInterface;
}> = object().shape({
  inputAssets: assetAmountValidation
});
