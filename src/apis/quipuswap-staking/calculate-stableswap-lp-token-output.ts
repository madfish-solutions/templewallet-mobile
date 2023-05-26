import { BigNumber } from 'bignumber.js';

import { toIntegerSeconds } from 'src/utils/date.utils';

const precision = new BigNumber(10).pow(18);
const aPrecision = new BigNumber(100);
const accumPrecision = new BigNumber(1e10);
const feeDenominator = new BigNumber(1e10);

interface TokenInfo {
  rateF: BigNumber;
  precisionMultiplierF: BigNumber;
  reserves: BigNumber;
}

interface FeesStorage {
  lpF: BigNumber;
  stakersF: BigNumber;
  refF: BigNumber;
}

interface StakerAccum {
  accumulatorF: BigNumber[];
  totalFees: BigNumber[];
  totalStaked: BigNumber;
}

interface Pool {
  initialAF: BigNumber;
  /** timestamp in seconds */
  initialATime: BigNumber;
  futureAF: BigNumber;
  /** timestamp in seconds */
  futureATime: BigNumber;
  tokensInfo: TokenInfo[];
  fee: FeesStorage;
  stakerAccumulator: StakerAccum;
  totalSupply: BigNumber;
}

interface BalancingAccum {
  stakerAccumulator: StakerAccum;
  tokensInfo: TokenInfo[];
  tokensInfoWithoutLp: TokenInfo[];
}

const xpMem = (tokensInfo: TokenInfo[]) => {
  return tokensInfo.map(({ rateF, reserves }) => rateF.times(reserves).dividedToIntegerBy(precision));
};

const getA = (
  /** timestamp in seconds */
  t0: BigNumber,
  a0: BigNumber,
  /** timestamp in seconds */
  t1: BigNumber,
  a1: BigNumber
) => {
  const nowTimestamp = new BigNumber(toIntegerSeconds(new Date()));

  if (nowTimestamp.lt(t1)) {
    const tNum = nowTimestamp.minus(t0);
    const tDen = t1.minus(t0);
    const diff = a1.minus(a0).abs();
    const value = diff.times(tNum).dividedToIntegerBy(tDen);

    return a1.gt(a0) ? a0.plus(value) : a0.minus(value).abs();
  }

  return a1;
};

const getD = (xp: BigNumber[], ampF: BigNumber) => {
  const sumC = xp.reduce((accum, i) => accum.plus(i), new BigNumber(0));
  const tokensCount = new BigNumber(xp.length);
  const aNnF = ampF.times(tokensCount);
  let d = sumC;
  let prevD = new BigNumber(0);

  while (d.minus(prevD).abs().gt(1)) {
    const dConst = d;
    const counted = xp.reduce(
      (accum, value) => [accum[0].times(dConst), accum[1].times(value.times(tokensCount))],
      [d, new BigNumber(1)]
    );
    const dP = counted[0].dividedToIntegerBy(counted[1]);
    prevD = d;
    d = aNnF
      .times(sumC)
      .dividedToIntegerBy(aPrecision)
      .plus(dP.times(tokensCount))
      .times(d)
      .dividedToIntegerBy(
        aNnF.minus(aPrecision).times(d).dividedToIntegerBy(aPrecision).plus(tokensCount.plus(1).times(dP))
      );
  }

  return d;
};

const getDMem = (tokensInfo: TokenInfo[], ampF: BigNumber) => {
  return getD(xpMem(tokensInfo), ampF);
};

const divideFeeForBalance = (fee: BigNumber, tokensCount: BigNumber) => {
  return fee.times(tokensCount).dividedToIntegerBy(tokensCount.minus(1).times(4));
};

const nipFeesOffReserves = (stakersFee: BigNumber, refFee: BigNumber, devFee: BigNumber, tokenInfo: TokenInfo) => {
  return {
    ...tokenInfo,
    reserves: tokenInfo.reserves.minus(stakersFee).minus(refFee).minus(devFee)
  };
};

const balanceInputs = (
  initTokensInfo: TokenInfo[],
  d0: BigNumber,
  newTokensInfo: TokenInfo[],
  d1: BigNumber,
  tokensCount: BigNumber,
  fees: FeesStorage,
  devFeeF: BigNumber,
  accumulator: BalancingAccum
) =>
  newTokensInfo.reduce((accum, tokenInfo, i) => {
    const oldInfo = initTokensInfo[i];
    const idealBalance = d1.times(oldInfo.reserves).dividedToIntegerBy(d0);
    const diff = idealBalance.minus(tokenInfo.reserves).abs();
    const toDev = diff.times(divideFeeForBalance(devFeeF, tokensCount)).dividedToIntegerBy(feeDenominator);
    const toRef = diff.times(divideFeeForBalance(fees.refF, tokensCount)).dividedToIntegerBy(feeDenominator);
    let toLp = diff.times(divideFeeForBalance(fees.lpF, tokensCount)).dividedToIntegerBy(feeDenominator);
    let toStakers = new BigNumber(0);

    if (accum.stakerAccumulator.totalStaked.isZero()) {
      toLp = toLp.plus(diff.times(divideFeeForBalance(fees.stakersF, tokensCount)).dividedToIntegerBy(feeDenominator));
    } else {
      toStakers = diff.times(divideFeeForBalance(fees.stakersF, tokensCount)).dividedToIntegerBy(feeDenominator);
      accum.stakerAccumulator.totalFees[i] = toStakers.plus(accum.stakerAccumulator.totalFees[i] ?? new BigNumber(0));
      accum.stakerAccumulator.accumulatorF[i] = toStakers
        .times(accumPrecision)
        .dividedToIntegerBy(accum.stakerAccumulator.totalStaked)
        .plus(accum.stakerAccumulator.accumulatorF[i] ?? new BigNumber(0));
    }

    const newTokenInfo = nipFeesOffReserves(toStakers, toRef, toDev, tokenInfo);
    accum.tokensInfo[i] = newTokenInfo;
    const newTokenInfoWithoutLp = {
      ...newTokenInfo,
      reserves: newTokenInfo.reserves.minus(toLp)
    };
    accum.tokensInfoWithoutLp[i] = newTokenInfoWithoutLp;

    return accum;
  }, accumulator);

export const calculateStableswapLpTokenOutput = (
  inputs: BigNumber[],
  pool: Pool,
  tokensCount: number,
  devFeeF: BigNumber
) => {
  const ampF = getA(pool.initialATime, pool.initialAF, pool.futureATime, pool.futureAF);
  const initTokensInfo = pool.tokensInfo;
  const d0 = getDMem(initTokensInfo, ampF);
  const tokenSupply = pool.totalSupply;
  const newTokensInfo = initTokensInfo.map((tokenInfo, key) => {
    const input = inputs[key] ?? new BigNumber(0);

    return {
      ...tokenInfo,
      reserves: tokenInfo.reserves.plus(input)
    };
  });
  const d1 = getDMem(newTokensInfo, ampF);

  if (tokenSupply.gt(0)) {
    const balanced = balanceInputs(
      initTokensInfo,
      d0,
      newTokensInfo,
      d1,
      new BigNumber(tokensCount),
      pool.fee,
      devFeeF,
      {
        stakerAccumulator: pool.stakerAccumulator,
        tokensInfo: newTokensInfo,
        tokensInfoWithoutLp: newTokensInfo.map(tokenInfo => ({ ...tokenInfo }))
      }
    );
    const d2 = getDMem(balanced.tokensInfoWithoutLp, ampF);

    return tokenSupply.times(d2.minus(d0)).dividedToIntegerBy(d0);
  }

  return d1;
};
