import { BigNumber } from 'bignumber.js';

import { bigIntClamp } from 'src/utils/big-number.utils';
import { toIntegerSeconds } from 'src/utils/date.utils';

import { accumPrecision, aPrecision, feeDenominator, precision } from './consts';
import {
  BalancingAccum,
  PrepareParamsAccum,
  StableswapFeesStorage,
  StableswapPool,
  StableswapTokenInfo,
  TooLowPoolReservesError
} from './types';

const xpMem = (tokensInfo: StableswapTokenInfo[]) => {
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

const getDMem = (tokensInfo: StableswapTokenInfo[], ampF: BigNumber) => {
  return getD(xpMem(tokensInfo), ampF);
};

const divideFeeForBalance = (fee: BigNumber, tokensCount: BigNumber) => {
  return fee.times(tokensCount).dividedToIntegerBy(tokensCount.minus(1).times(4));
};

const nipFeesOffReserves = (
  stakersFee: BigNumber,
  refFee: BigNumber,
  devFee: BigNumber,
  tokenInfo: StableswapTokenInfo
) => {
  return {
    ...tokenInfo,
    reserves: tokenInfo.reserves.minus(stakersFee).minus(refFee).minus(devFee)
  };
};

const balanceInputs = (
  initTokensInfo: StableswapTokenInfo[],
  d0: BigNumber,
  newTokensInfo: StableswapTokenInfo[],
  d1: BigNumber,
  tokensCount: BigNumber,
  fees: StableswapFeesStorage,
  devFee: BigNumber,
  accumulator: BalancingAccum
) =>
  newTokensInfo.reduce((accum, tokenInfo, i) => {
    const oldInfo = initTokensInfo[i];
    const idealBalance = d1.times(oldInfo.reserves).dividedToIntegerBy(d0);
    const diff = idealBalance.minus(tokenInfo.reserves).abs();
    const toDev = diff.times(divideFeeForBalance(devFee, tokensCount)).dividedToIntegerBy(feeDenominator);
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

const sumAllFee = (fee: StableswapFeesStorage, devFee: BigNumber) =>
  fee.lpF.plus(fee.stakersF).plus(fee.refF).plus(devFee);

const calcY = (c: BigNumber, aNNF: BigNumber, s_: BigNumber, d: BigNumber, pool: StableswapPool) => {
  const tokensCount = pool.tokensInfo.length;
  c = c.times(d).times(aPrecision).div(aNNF.times(tokensCount)).integerValue(BigNumber.ROUND_CEIL);
  const b = s_.plus(d.times(aPrecision).dividedToIntegerBy(aNNF));
  let tmp = { y: d, prevY: new BigNumber(0) };
  while (tmp.y.minus(tmp.prevY).abs().gt(1)) {
    tmp = { ...tmp, prevY: tmp.y };
    tmp.y = tmp.y
      .times(tmp.y)
      .plus(c)
      .div(tmp.y.times(2).plus(b.minus(d)))
      .integerValue(BigNumber.ROUND_CEIL);
  }

  return tmp.y;
};

const getYD = (ampF: BigNumber, i: number, xp: BigNumber[], d: BigNumber, pool: StableswapPool) => {
  const tokensCount = pool.tokensInfo.length;

  const aNNF = ampF.times(tokensCount);

  const res = xp.reduce<PrepareParamsAccum>(
    (accum, value, index) => {
      if (index !== i) {
        accum.s_ = accum.s_.plus(value);
        accum.c[0] = accum.c[0].times(d);
        accum.c[1] = accum.c[1].times(value.times(tokensCount));
      }

      return accum;
    },
    { s_: new BigNumber(0), c: [d, new BigNumber(1)] }
  );
  const c = res.c[0].dividedToIntegerBy(res.c[1]).integerValue(BigNumber.ROUND_CEIL);

  return calcY(c, aNNF, res.s_, d, pool);
};

const calculateLpTokensToBurn = (outputs: BigNumber[], pool: StableswapPool, devFee: BigNumber) => {
  const ampF = getA(pool.initialATime, pool.initialAF, pool.futureATime, pool.futureAF);
  const initTokensInfo = pool.tokensInfo;
  const d0 = getD(xpMem(initTokensInfo), ampF);
  const tokenSupply = pool.totalSupply;

  const newTokensInfo = outputs.map((value, index) => {
    const newReserves = initTokensInfo[index].reserves.minus(value);

    if (Boolean(newReserves.lte(0))) {
      throw new TooLowPoolReservesError();
    }

    return {
      ...initTokensInfo[index],
      reserves: newReserves
    };
  });

  const d1 = getD(xpMem(newTokensInfo), ampF);
  const balanced = balanceInputs(
    initTokensInfo,
    d0,
    newTokensInfo,
    d1,
    new BigNumber(pool.tokensInfo.length),
    pool.fee,
    devFee,
    {
      stakerAccumulator: pool.stakerAccumulator,
      tokensInfo: newTokensInfo,
      tokensInfoWithoutLp: newTokensInfo.map(tokenInfo => ({ ...tokenInfo }))
    }
  );
  const d2 = getD(xpMem(balanced.tokensInfoWithoutLp), ampF);

  return d0.minus(d2).times(tokenSupply).div(d0).integerValue(BigNumber.ROUND_UP);
};

const estimateStableswapWithdrawTokenOutput = (
  shares: BigNumber,
  tokenIndex: number,
  pool: StableswapPool,
  devFee: BigNumber
) => {
  const token = pool.tokensInfo[tokenIndex];
  const ampF = getA(pool.initialATime, pool.initialAF, pool.futureATime, pool.futureAF);
  const tokensCount = pool.tokensInfo.length;
  const xp = xpMem(pool.tokensInfo);
  const d0 = getD(xp, ampF);
  const totalSupply = pool.totalSupply;
  const d1 = d0.minus(shares.times(d0).dividedToIntegerBy(totalSupply));
  const newY = getYD(ampF, tokenIndex, xp, d1, pool);
  const baseFeeF = sumAllFee(pool.fee, devFee);

  const xpReduced = xp.map((value, index) => {
    const dxExpected =
      index === tokenIndex
        ? value.times(d1).dividedToIntegerBy(d0).minus(newY)
        : value.minus(value.times(d1).dividedToIntegerBy(d0));

    return value.minus(
      dxExpected.times(divideFeeForBalance(baseFeeF, new BigNumber(tokensCount))).dividedToIntegerBy(feeDenominator)
    );
  });

  const dy = xpReduced[tokenIndex]
    .minus(getYD(ampF, tokenIndex, xpReduced, d1, pool))
    .dividedToIntegerBy(token.precisionMultiplierF);

  if (dy.gte(token.reserves)) {
    throw new TooLowPoolReservesError();
  }

  return dy;
};

export const calculateStableswapWithdrawTokenOutput = (
  shares: BigNumber,
  tokenIndex: number,
  pool: StableswapPool,
  devFee: BigNumber
) => {
  const functionToZero = (x: BigNumber) => {
    let tokensToBurn: BigNumber;
    try {
      tokensToBurn = calculateLpTokensToBurn(
        pool.tokensInfo.map((_, index) => (index === tokenIndex ? x : new BigNumber(0))),
        pool,
        devFee
      );
    } catch (e) {
      if (e instanceof TooLowPoolReservesError) {
        tokensToBurn = pool.totalSupply;
      } else {
        throw e;
      }
    }

    return tokensToBurn.minus(shares);
  };
  const xAnalytical = estimateStableswapWithdrawTokenOutput(shares, tokenIndex, pool, devFee);
  const yAnalytical = functionToZero(xAnalytical);

  if (yAnalytical.isZero()) {
    return xAnalytical;
  }

  let i = 0;
  let x0: BigNumber, y0: BigNumber, x1: BigNumber, y1: BigNumber;

  if (yAnalytical.gt(0)) {
    x0 = new BigNumber(0);
    y0 = shares.negated();
    x1 = xAnalytical;
    y1 = yAnalytical;
  } else {
    x0 = xAnalytical;
    y0 = yAnalytical;
    x1 = pool.tokensInfo[tokenIndex].reserves;
    y1 = pool.totalSupply.minus(shares);
  }

  while (x1.minus(x0).gt(1) && i < 100) {
    i++;
    /** Candidate for X value from chord method */
    const x2 = bigIntClamp(
      x1.minus(y1.multipliedBy(x1.minus(x0)).dividedToIntegerBy(y1.minus(y0))),
      x0.plus(1),
      x1.minus(1)
    );
    const y2 = functionToZero(x2);

    if (y2.isZero()) {
      return x2;
    }

    /** Candidate for X value based on linear extrapolation of the function from (x0, y0) and (x2, y2)
     * or (x1, y1) and (x2, y2) points
     */
    const x3 = bigIntClamp(
      y2.eq(y0)
        ? x1.minus(x2.minus(x1).times(y1).dividedToIntegerBy(y2.minus(y1)))
        : x0.minus(x2.minus(x0).times(y0).dividedToIntegerBy(y2.minus(y0))),
      x0.plus(1),
      x1.minus(1)
    );
    const y3 = functionToZero(x3);

    if (y3.isZero()) {
      return x3;
    }

    const knownPoints = [
      [x0, y0],
      [x1, y1],
      [x2, y2],
      [x3, y3]
    ];
    const lowerLimits = knownPoints.filter(([, y]) => y.lt(0));
    const upperLimits = knownPoints.filter(([, y]) => y.gt(0));
    [x0, y0] = lowerLimits.reduce(([bestX, bestY], [x, y]) => (y.gt(bestY) ? [x, y] : [bestX, bestY]));
    [x1, y1] = upperLimits.reduce(([bestX, bestY], [x, y]) => (y.lt(bestY) ? [x, y] : [bestX, bestY]));
  }

  return x0;
};

export const calculateStableswapLpTokenOutput = (
  inputs: BigNumber[],
  pool: StableswapPool,
  tokensCount: number,
  devFee: BigNumber
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
      devFee,
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
