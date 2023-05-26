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

const sumAllFee = (fee: StableswapFeesStorage, devFeeF: BigNumber) =>
  fee.lpF.plus(fee.stakersF).plus(fee.refF).plus(devFeeF);

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

const calculateLpTokensToBurn = (outputs: BigNumber[], pool: StableswapPool, devFeeF: BigNumber) => {
  const ampF = getA(pool.initialATime, pool.initialAF, pool.futureATime, pool.futureAF);
  const initTokensInfo = pool.tokensInfo;
  const d0 = getD(xpMem(initTokensInfo), ampF);
  const tokenSupply = pool.totalSupply;

  const newTokensInfo = outputs.map((value, index) => {
    const newReserves = initTokensInfo[index].reserves.minus(value);

    if (newReserves.lte(0)) {
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
    devFeeF,
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
  devFeeF: BigNumber
) => {
  const token = pool.tokensInfo[tokenIndex];
  const ampF = getA(pool.initialATime, pool.initialAF, pool.futureATime, pool.futureAF);
  const tokensCount = pool.tokensInfo.length;
  const xp = xpMem(pool.tokensInfo);
  const d0 = getD(xp, ampF);
  const totalSupply = pool.totalSupply;
  const d1 = d0.minus(shares.times(d0).dividedToIntegerBy(totalSupply));
  const newY = getYD(ampF, tokenIndex, xp, d1, pool);
  const baseFeeF = sumAllFee(pool.fee, devFeeF);

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
  devFeeF: BigNumber
) => {
  const functionToZero = (x: BigNumber) =>
    calculateLpTokensToBurn(
      pool.tokensInfo.map((_, index) => (index === tokenIndex ? x : new BigNumber(0))),
      pool,
      devFeeF
    ).minus(shares);
  const xAnalytical = estimateStableswapWithdrawTokenOutput(shares, tokenIndex, pool, devFeeF);
  const yAnalytical = functionToZero(xAnalytical);

  if (yAnalytical.isZero()) {
    return xAnalytical;
  }

  let i = 0;
  let x0: BigNumber, y0: BigNumber, x1: BigNumber, y1: BigNumber;

  if (yAnalytical.gt(shares)) {
    x0 = new BigNumber(0);
    y0 = shares.negated();
    x1 = xAnalytical;
    y1 = yAnalytical;
  } else {
    x0 = xAnalytical;
    y0 = yAnalytical;
    x1 = new BigNumber(Infinity);
    y1 = new BigNumber(Infinity);
  }

  while (x1.minus(x0).gt(1) && i < 100) {
    i++;
    const x2 = bigIntClamp(
      x1.isFinite() && y1.isFinite()
        ? x1.minus(y1.multipliedBy(x1.minus(x0)).dividedToIntegerBy(y1.minus(y0)))
        : x0.times(shares).dividedToIntegerBy(y0.plus(shares)),
      x0.plus(1),
      x1.minus(1)
    );
    let y2: BigNumber;
    try {
      y2 = functionToZero(x2);
    } catch {
      x1 = x2;
      y1 = new BigNumber(Infinity);
      continue;
    }

    if (y2.isZero()) {
      return x2;
    }

    if (y2.gt(0)) {
      x1 = x2;
      y1 = y2;
    } else {
      x0 = x2;
      y0 = y2;
    }
  }

  return x0;
};
