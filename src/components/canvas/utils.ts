import { LINE_TYPE, LineDataType } from '@utils';
import { EllipseCurve, Group, Mesh, Object3D, Vector2 } from 'three';
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

let REPOSITIONED = true;
export const getCurrentPoint = (
  points: GeoPointType[],
  progress: number,
): [Vector2, PointType, boolean] => {
  let startPoint: Vector2 | undefined;
  let endPoint: Vector2 | undefined;
  let currentPoint: Vector2 | undefined;
  let length = 0;
  let prevLength = 0;
  let pointType: PointType = POINT_TYPE.GEO;
  let reposition = false;

  for (let i = 0; i < points.length; i++) {
    const { point, type } = points[i];

    if (!points[i + 1]) return [point, type, false];

    length += point.distanceTo(points[i + 1].point);
    pointType = type;

    if (length >= progress) {
      // Reposition workpiece before current line
      if (points[i - 1]?.type === POINT_TYPE.REPOS && !REPOSITIONED) {
        REPOSITIONED = reposition = true;
      }

      startPoint = point;
      endPoint = points[i + 1].point;

      // Set to reposition (flip) workpiece before next line
      if (points[i + 2]?.type === POINT_TYPE.REPOS) {
        REPOSITIONED = false;
      }
      break;
    } else {
      prevLength = length;
    }
  }

  if (!startPoint || !endPoint)
    throw new Error('Cannot evaluate tool animation [no points]');

  const currentProgress = progress - prevLength;
  const currentLength = length - prevLength;
  const lineProgress = currentProgress / currentLength;

  if (currentProgress <= 0) currentPoint = startPoint.clone();
  else if (currentLength - currentProgress < 2) currentPoint = endPoint.clone();
  else currentPoint = startPoint.clone().lerp(endPoint, lineProgress);

  return [currentPoint, pointType, reposition];
};

export const prepareLathePoint = (point: Vector2) => {
  return point.clone().rotateAround(new Vector2(0, 0), Math.PI / 2);
};

export const clearToolPathLines = (linesGroup: Group) => {
  while (linesGroup?.children.length > 0) {
    const child = linesGroup.children[0] as Mesh;
    child.geometry.dispose();
    linesGroup.remove(child);
  }
};
