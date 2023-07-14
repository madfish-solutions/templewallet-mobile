import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { BlockInfo } from 'src/interfaces/block-info.interface';
import { FarmBase } from 'src/interfaces/farm-base.interface';

export interface LiquidityBakingFarm extends FarmBase {
  type: FarmPoolTypeEnum.LIQUIDITY_BAKING;
}

export interface LiquidityBakingFarmResponse {
  item: LiquidityBakingFarm;
  blockInfo: BlockInfo;
}
