import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { range } from 'lodash-es';

import { BigMap } from 'src/interfaces/big-map.interface';
import { isTruthy } from 'src/utils/is-truthy';
import { getContractStorage, getReadOnlyContract } from 'src/utils/rpc/contract.utils';

interface DeployedStrategiesKey {
  pool_contract: string;
  pool_id: BigNumber;
}
interface ConnectedPoolsValue {
  pool_contract: string;
  pool_id: BigNumber;
}
interface Dev {
  dev_address: string;
  temp_dev_address: string | nullish;
}
interface StrategyFactoryContractStorageRoot {
  dev: Dev;
  lending_contract: string;
  deployed_strategies: BigMap<DeployedStrategiesKey, string>;
  connected_pools: BigMap<string, ConnectedPoolsValue>;
}

interface FA12Token {
  fa12: string;
}
interface FA2Token {
  fa2: {
    token_address: string;
    token_id: BigNumber;
  };
}
type PoolDataTokenMapValue = FA12Token | FA2Token;
interface RootTokenMapValue {
  lending_market_id: BigNumber;
  desired_reserves_rate_f: BigNumber;
  delta_rate_f: BigNumber;
  min_invest: BigNumber;
  enabled: BigNumber;
  invested_tokens: BigNumber;
}
interface PoolData {
  pool_contract: string;
  pool_id: BigNumber;
  token_map: MichelsonMap<BigNumber, PoolDataTokenMapValue>;
}
interface StrategyContractStorageRoot {
  factory: string;
  pool_data: PoolData;
  token_map: MichelsonMap<BigNumber, RootTokenMapValue>;
}

interface YupanaRebalanceProps {
  tezos: TezosToolkit;
  stableswapContractAddress: string;
  stableswapPoolId: number;
  tokensInPool: number;
}

const prepareStrategyInfo = async ({
  tezos,
  stableswapContractAddress,
  stableswapPoolId
}: Omit<YupanaRebalanceProps, 'tokensInPool'>) => {
  const strategyFactoryContractStorage = await getContractStorage<StrategyFactoryContractStorageRoot>(
    tezos,
    'KT1Ka16bLMsscw5FYxKNweQskUr3GdTQqG4J'
  );

  const strategyContractAddress = await strategyFactoryContractStorage.deployed_strategies.get({
    pool_contract: stableswapContractAddress,
    pool_id: new BigNumber(stableswapPoolId)
  });

  const strategyContractStorage = await getContractStorage<StrategyContractStorageRoot>(
    tezos,
    strategyContractAddress!
  );

  const yupanaAddress = strategyFactoryContractStorage.lending_contract;
  const tokenMap = strategyContractStorage.token_map;

  return {
    yupanaAddress,
    tokenMap
  };
};

export const getYupanaRebalanceParams = async ({
  tezos,
  stableswapContractAddress,
  stableswapPoolId,
  tokensInPool
}: YupanaRebalanceProps) => {
  const { tokenMap, yupanaAddress } = await prepareStrategyInfo({
    tezos,
    stableswapContractAddress,
    stableswapPoolId
  });

  const yupanaContract = await getReadOnlyContract(yupanaAddress, tezos);

  const updateInterestParams = range(0, tokensInPool).map(id => {
    const tokenInvestmentInfo = tokenMap.get(new BigNumber(id));

    const lid = tokenInvestmentInfo?.lending_market_id;
    if (lid) {
      return yupanaContract.methodsObject.updateInterest(lid).toTransferParams();
    }

    return null;
  });

  return updateInterestParams.filter(isTruthy);
};
