import { useFrame } from '@react-three/fiber';
import { CylinderSizeType, LINE_TYPE, LineDataType } from '@utils';
import { Dispatch, memo, SetStateAction, useRef } from 'react';
import {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  Line,
  Vector2,
  BufferAttribute,
  LineDashedMaterial,
  Mesh,
} from 'three';
import {
  DASH_SIZE,
  GAP_SIZE,
  LINE_ANIMATION_RATE,
  LINE_COLOR,
  POSITION_LINE_COLOR,
} from './constants';
import { GeoPointType, LineElementType, POINT_TYPE, PointType } from './types';
import { getCurrentPoint, getCurvePoints } from './utils';

type LineElementProps = {
  updateLathePoints: Dispatch<SetStateAction<Vector2[]>>;
  linesData: LineDataType[];
  cylinderSize: CylinderSizeType;
};

export const LineElement = ({
  updateLathePoints,
  linesData,
  cylinderSize,
}: LineElementProps) => {
  const linesGroupRef = useRef<Group>(null!);
  const geometryPoints: GeoPointType[] = [];
  const lines: LineElementType[] = [];

  let animationLength = 0;
  let animationProgress = 0;

  linesData.forEach((lineData) => {
    const { type, start, end } = lineData;
    const startPoint = new Vector2(start.x, start.z);
    const endPoint = new Vector2(end.x, end.z);

    if (type === LINE_TYPE.ARC) {
      const { curvePoints, curveLength } = getCurvePoints(lineData);
      geometryPoints.push(
        ...curvePoints.map((point) => ({ point, type: POINT_TYPE.GEO })),
      );

      lines.push({
        points: curvePoints,
        lineLength: curveLength,
        initProgress: animationLength,
        endProgress: animationLength + curveLength,
        positioning: false,
      });

      animationLength += curveLength;
    } else {
      if (type === LINE_TYPE.POSITIONING)
        geometryPoints.push(
          { point: startPoint, type: POINT_TYPE.POS },
          { point: endPoint, type: POINT_TYPE.POS },
        );
      else
        geometryPoints.push(
          { point: startPoint, type: POINT_TYPE.GEO },
          { point: endPoint, type: POINT_TYPE.GEO },
        );

      const lineLength = startPoint.distanceTo(endPoint);
      lines.push({
        points: [startPoint, endPoint],
        lineLength,
        initProgress: animationLength,
        endProgress: animationLength + lineLength,
        positioning: type === LINE_TYPE.POSITIONING,
      });

      animationLength += lineLength;
    }
  });

  updateLathePoints([]);

  const lastPoint = { x: -Infinity, y: -Infinity };
  let lastType: PointType | undefined = undefined;

  // remove lines before animation
  while (linesGroupRef.current?.children.length > 0) {
    const child = linesGroupRef.current.children[0] as Mesh;
    child.geometry.dispose();
    linesGroupRef.current.remove(child);
  }

  useFrame(() => {
    if (animationProgress > animationLength || !lines.length) return;

    const [currentPoint, currentPointType] = getCurrentPoint(
      geometryPoints,
      animationProgress,
    );

    // Points for lines (2D)
    if (lastType === currentPointType) {
      const lastLine = linesGroupRef.current.children.at(-1) as Line;

      if (lastLine?.type === 'Line') {
        const currentPoints = lastLine.geometry.attributes.position.array;
        const newPoints = new Float32Array(currentPoints.length + 3);
        newPoints.set([...currentPoints, ...currentPoint, 0]);

        lastLine.geometry.setAttribute(
          'position',
          new BufferAttribute(newPoints, 3),
        );

        lastLine.geometry.computeBoundingSphere();
        lastLine.computeLineDistances();
      }
    } else {
      lastType = currentPointType;
      const geometry = new BufferGeometry().setFromPoints([currentPoint]);
      const material =
        currentPointType === POINT_TYPE.GEO
          ? new LineBasicMaterial({ color: LINE_COLOR })
          : new LineDashedMaterial({
              color: POSITION_LINE_COLOR,
              dashSize: DASH_SIZE,
              gapSize: GAP_SIZE,
            });

      const line = new Line(geometry, material);
      line.computeLineDistances();
      linesGroupRef.current.add(line);
    }

    // Point for lathing (3D model)
    if (
      currentPoint.x <= cylinderSize.length &&
      currentPointType === POINT_TYPE.GEO
    ) {
      const x = currentPoint.x;
      const y = Math.min(currentPoint.y, cylinderSize.radius);
      if (lastPoint.x !== x || lastPoint.y !== y)
        updateLathePoints((prev) => [...prev, new Vector2(x, y)]);

      lastPoint.x = x;
      lastPoint.y = y;
    }

    const rate = animationLength / LINE_ANIMATION_RATE;

    animationProgress += rate;
  });

  return <group ref={linesGroupRef} />;
};

export const LineElementMemo = memo(LineElement);
