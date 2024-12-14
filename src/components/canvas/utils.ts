import { LINE_TYPE, LineDataType } from '@utils';
import { EllipseCurve, Object3D, Vector2 } from 'three';
import { CURVE_POINTS, DASH_SIZE, GAP_SIZE } from './constants';
import { GeoPointType, LineElementType, POINT_TYPE, PointType } from './types';

export const getCurvePoints = (lineData: LineDataType) => {
  if (lineData.type !== LINE_TYPE.ARC)
    return { curvePoints: [], curveLength: 0 };

  const { start, end, center, counterClockwise } = lineData;
  const angleStart = Math.atan2(start.z - center.z, start.x - center.x);
  const angleEnd = Math.atan2(end.z - center.z, end.x - center.x);

  const radius = Math.sqrt(
    (center.x - start.x) ** 2 + (center.z - start.z) ** 2,
  );

  const curve = new EllipseCurve(
    center.x,
    center.z,
    radius,
    radius,
    angleStart,
    angleEnd,
    !counterClockwise,
  );

  return {
    curvePoints: curve.getPoints(CURVE_POINTS),
    curveLength: curve.getLength(),
  };
};

export const lineAnimation =
  (lines: LineElementType[], progress: number, rate: number) =>
  (line: Object3D, i: number) => {
    if (lines[i].initProgress > progress || lines[i].endProgress < progress)
      return;

    //@ts-expect-error three js types error
    const lineMaterial = line.material;

    lineMaterial.dashSize = progress - lines[i].initProgress;

    if (lines[i].endProgress <= progress + rate) {
      lineMaterial.dashSize = lines[i].lineLength;

      if (lines[i].positioning) {
        lineMaterial.dashSize = DASH_SIZE;
        lineMaterial.gapSize = GAP_SIZE;
      }
    }
  };

export const getCurrentPoint = (
  points: GeoPointType[],
  progress: number,
): [Vector2, PointType] => {
  let startPoint: Vector2 | undefined;
  let endPoint: Vector2 | undefined;
  let currentPoint: Vector2 | undefined;
  let length = 0;
  let prevLength = 0;
  let pointType: PointType = POINT_TYPE.GEO;

  for (const [i, { point, type }] of points.entries()) {
    if (!points[i + 1]) return [point, type];

    length += point.distanceTo(points[i + 1].point);
    pointType = type;

    if (length >= progress) {
      startPoint = point;
      endPoint = points[i + 1].point;
      break;
    } else prevLength = length;
  }

  if (!startPoint || !endPoint)
    throw new Error('Cannot evaluate tool animation [no points]');

  const currentProgress = progress - prevLength;
  const currentLength = length - prevLength;
  const lineProgress = currentProgress / currentLength;

  if (currentProgress <= 0) currentPoint = startPoint.clone();
  else if (currentLength - currentProgress < 0.05)
    currentPoint = endPoint.clone();
  else currentPoint = startPoint.clone().lerp(endPoint, lineProgress);

  return [currentPoint, pointType];
};

export const prepareLathePoint = (point: Vector2) => {
  return point.clone().rotateAround(new Vector2(0, 0), Math.PI / 2);
};
