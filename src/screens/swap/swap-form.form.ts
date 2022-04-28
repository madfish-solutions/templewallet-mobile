import { object, SchemaOf } from 'yup';

import { assetAmountValidation } from '../../form/validation/asset-amount';
import { SwapFormValues } from '../../interfaces/swap-asset.interface';

export const swapFormValidationSchema: SchemaOf<SwapFormValues> = object().shape({
  inputAssets: assetAmountValidation,
  outputAssets: assetAmountValidation,
  bestTrade: object().shape({}).nullable().required(),
  bestTradeWithSlippageTolerance: object().shape({}).nullable()
});
