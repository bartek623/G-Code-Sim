import { Vector2 } from 'three';
import { ValuesType } from '@/utils';

export type LineElementType = {
  points: Vector2[];
  lineLength: number;
  initProgress: number;
  endProgress: number;
  positioning: boolean;
};

export const POINT_TYPE = {
  GEO: 'geo',
  POS: 'pos',
} as const;

export type PointType = ValuesType<typeof POINT_TYPE>;

export type GeoPointType = {
  type: PointType;
  point: Vector2;
};
