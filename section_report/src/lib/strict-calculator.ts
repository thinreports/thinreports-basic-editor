import BigNumber from 'bignumber.js';

export const calcDiv = (a: number | BigNumber, b: number | BigNumber): number => new BigNumber(a).div(b).toNumber();
export const calcPlus = (a: number | BigNumber, b: number | BigNumber): number => new BigNumber(a).plus(b).toNumber();
export const calcMinus = (a: number | BigNumber, b: number | BigNumber): number => new BigNumber(a).minus(b).toNumber();
export const calcMul = (a: number | BigNumber, b: number | BigNumber): number => new BigNumber(a).multipliedBy(b).toNumber();
