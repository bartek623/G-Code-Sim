import { EllipseCurve, Object3D } from "three";
import { CURVE_POINTS, DASH_SIZE, GAP_SIZE } from "./constants";
import { LINE_TYPE, LineDataType } from "../../utils/types";
import { LineElementType } from "./types";

export const getCurvePoints = (lineData: LineDataType) => {
  if (lineData.type !== LINE_TYPE.ARC)
    return { curvePoints: [], curveLength: 0 };

  const { start, end, center, counterClockwise } = lineData;
  const angleStart = Math.atan2(start.y - center.y, start.x - center.x);
  const angleEnd = Math.atan2(end.y - center.y, end.x - center.x);

  const radius = Math.sqrt(
    (center.x - start.x) ** 2 + (center.y - start.y) ** 2
  );

  const curve = new EllipseCurve(
    center.x,
    center.y,
    radius,
    radius,
    angleStart + angleEnd,
    angleEnd + angleEnd,
    !counterClockwise,
    -angleEnd
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
