import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { BlockInfo } from 'src/interfaces/block-info.interface';
import { FarmBase } from 'src/interfaces/earn-opportunity/farm-base.interface';

export interface LiquidityBakingFarm extends FarmBase {
  type: EarnOpportunityTypeEnum.LIQUIDITY_BAKING;
}

export interface LiquidityBakingFarmResponse {
  item: LiquidityBakingFarm;
  blockInfo: BlockInfo;
}
