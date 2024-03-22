import { Rational } from '../rational';

export type CostKey =
  | 'factor'
  | 'machine'
  | 'footprint'
  | 'unproduceable'
  | 'excluded'
  | 'surplus'
  | 'maximize';

export type CostsState = Record<CostKey, Rational>;

/** In Factorio, one item ~= ten fluid units */
export const FACTORIO_FLUID_COST_RATIO = Rational.ten.reciprocal();
