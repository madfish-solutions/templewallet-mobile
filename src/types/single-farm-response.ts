import { LiquidityBakingFarmResponse } from 'src/apis/liquidity-baking/types';
import { SingleQuipuswapFarmResponse } from 'src/apis/quipuswap-staking/types';

export type SingleFarmResponse = SingleQuipuswapFarmResponse | LiquidityBakingFarmResponse;
