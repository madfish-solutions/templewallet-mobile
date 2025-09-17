/** This interface is not complete */
export interface TzktProtocol {
  hash: string;
  constants: {
    attestersPerBlock: number;
    consensusThreshold: number;
    blocksPerCycle: number;
    blockReward: number[];
    attestationReward: number[];
  };
}
