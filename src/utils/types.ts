export const LINE_TYPE = {
  POSITIONING: 'positioning',
  LINE: 'line',
  ARC: 'arc',
} as const;

export type ValuesType<T> = T[keyof T];

export type LineType = ValuesType<typeof LINE_TYPE>;

export type PointType = { x: number; z: number };

export type LinesType =
  | {
      type: 'positioning' | 'line';
    }
  | {
      type: 'arc';
      center: PointType;
      counterClockwise?: boolean;
    };

export type LineDataType = LinesType & {
  end: PointType;
  start: PointType;
};

export type CylinderSizeType = { radius: number; length: number };
