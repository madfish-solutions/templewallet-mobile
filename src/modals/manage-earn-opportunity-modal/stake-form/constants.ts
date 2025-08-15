import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

const youvesSavingsRisksPoints = [
  'The value of a yield-generating asset may not perfectly track its reference value, however with the conversion rights, the holder has a protection against significant price differences that may occur.',
  'There is a risk that the collateral is not managed adequately and, in extreme scenarios, the protection via the conversion can no longer be kept. Such situations may require a liquidation of YOU staked tokens.',
  'Liquidity providers consider the risk of impermanent loss, however, due to the nature of the youves flat-curves (CFMM) and the highly-correlated asset pairs, such risks are much lower than on constant product market maker (CPMM) DEXs with uncorrelated pairs.'
];

const quipuswapFarmsRisksPoints = [
  'Smart Contract Reliability: This pool operates using DEX smart contracts, farming smart contracts, QuipuSwap stable pools smart contracts and interacts with Yupana Lending protocol contracts. The safety of your assets is dependent on the reliability and security of these contracts. While external audits of smart contracts have been conducted, there is always a risk of potential vulnerabilities or unforeseen issues that could impact the safety of your assets.',
  'Stable Token Value: Stable tokens are designed to maintain a stable value relative to a benchmark, such as a fiat currency. However, there is a risk that the value of stable tokens may not perfectly track their benchmark value. Factors such as the conversion conditions and operational mechanisms specific to each stable token can influence its value. It is important to be aware of this potential risk when using stable tokens in this pool.',
  'Market Risk: Farming involves exposure to the performance and volatility of the assets in the liquidity pool. Fluctuations in the market value of the assets can impact the overall value of the farm and potentially lead to losses. It is essential to consider the risks associated with the specific assets and their market dynamics.',
  'Slippage: Slippage refers to the difference between the expected and actual execution price of a trade. In fast-moving markets or with illiquid assets, slippage can be significant and impact profitability.',
  'Regulatory and Compliance Risks: Depending on your jurisdiction, participating in farming may have legal and regulatory implications. It is important to ensure compliance with applicable laws, tax obligations, and any necessary licenses or permissions.'
];

const liquidityBakingRisksPoints = [
  'Smart Contract Reliability: Liquidity Baking relies on smart contracts, and the safety of your assets depends on the reliability and security of these contracts. While external audits have been conducted, there is always a risk of potential vulnerabilities or unforeseen issues that could impact the safety of your assets.',
  'Impermanent Loss: When providing liquidity to the Liquidity Baking pool, the value of the tokens (tzBTC and TEZ) may fluctuate in comparison to the market. This can result in impermanent loss, where the value of your assets decreases relative to holding them separately.',
  'Price Volatility: The value of tokens in the Liquidity Baking pool can experience significant price fluctuations due to market conditions and trading activities. Sudden price movements can impact the overall value of your farming position.',
  'Market Risk: The performance of the tokens you are farming can be influenced by various market factors such as supply and demand dynamics, regulatory changes, macroeconomic conditions, and investor sentiment. These factors can affect the profitability and sustainability of your farming strategy.',
  'Slippage: Slippage refers to the difference between the expected and actual execution price of a trade. In fast-moving markets or with illiquid assets, slippage can be significant and impact profitability.',
  "Counterparty Risk: tzBTC, being a highly centralized asset, carries the risk of being influenced quickly. While it provides significant liquidity to the Tezos ecosystem, it's important to consider the potential impact of any actions or decisions made by the centralized party on the value and availability of tzBTC."
];

export const earnOpportunitiesRisksPoints: Record<EarnOpportunityTypeEnum, string[]> = {
  [EarnOpportunityTypeEnum.YOUVES_SAVING]: youvesSavingsRisksPoints,
  [EarnOpportunityTypeEnum.YOUVES_STAKING]: youvesSavingsRisksPoints,
  [EarnOpportunityTypeEnum.DEX_TWO]: quipuswapFarmsRisksPoints,
  [EarnOpportunityTypeEnum.STABLESWAP]: quipuswapFarmsRisksPoints,
  [EarnOpportunityTypeEnum.LIQUIDITY_BAKING]: liquidityBakingRisksPoints
};
