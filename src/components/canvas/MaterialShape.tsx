import { Cylinder, Lathe, Line, Points } from '@react-three/drei';
import { DoubleSide, Vector2 } from 'three';
import {
  GEO_ROTATIONS,
  STEEL_COLOR,
  TRANSPARENT_MATERIAL_OFFSET,
  TRANSPARENT_MATERIAL_OPACITY,
} from './constants';
import { prepareLathePoint } from './utils';
import { useGeometryContext } from '@/store';

type MaterialShapeProps = {
  latheState: Vector2[];
};

type TwoDViewProps = {
  radius: number;
  length: number;
};

type ThreeDViewProps = { points: Vector2[] } & TwoDViewProps;

function ThreeDView({ radius, length, points }: ThreeDViewProps) {
  const { showWorkpiece, geometryRef } = useGeometryContext();

  const cappedPoints = points.flatMap((point) => {
    if (point.x > length) return [];

    return point.y > radius
      ? [prepareLathePoint(new Vector2(point.x, radius))]
      : [prepareLathePoint(point)];
  });

  // add beginning of the workpiece
  if (!points.find((point) => point.x <= 0))
    cappedPoints.unshift(prepareLathePoint(new Vector2(0, radius)));

  cappedPoints.unshift(prepareLathePoint(new Vector2(0, 0)));

  // align last point to workpiece
  const lastPoint = points.at(-1);
  if (lastPoint && length - lastPoint.x < 0.1) lastPoint.x = length;

  // add rest of the workpiece beyond tool path
  if (!points.find((point) => point.x >= length))
    cappedPoints.push(
      prepareLathePoint(new Vector2(points.at(-1)?.x || length, radius)),
      prepareLathePoint(new Vector2(length, radius)),
    );

  cappedPoints.push(prepareLathePoint(new Vector2(length, 0)));

  return (
    <>
      <Lathe
        ref={geometryRef}
        args={[cappedPoints, GEO_ROTATIONS]}
        rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial
          color={STEEL_COLOR}
          roughness={0.5}
          metalness={1}
          side={DoubleSide}
        />
      </Lathe>
      {showWorkpiece && (
        <Cylinder
          args={[radius, radius, length]}
          rotation={[0, 0, -Math.PI / 2]}
          position={[length / 2, 0, 0]}>
          <meshStandardMaterial
            polygonOffset
            polygonOffsetFactor={TRANSPARENT_MATERIAL_OFFSET}
            polygonOffsetUnits={TRANSPARENT_MATERIAL_OFFSET}
            color={STEEL_COLOR}
            transparent={true}
            opacity={TRANSPARENT_MATERIAL_OPACITY}
            depthWrite={false}
          />
        </Cylinder>
      )}
    </>
  );
}

function TwoDView({ radius, length }: TwoDViewProps) {
  const cylinderOutlinePoints = [
    new Vector2(0, -radius),
    new Vector2(0, radius),
    new Vector2(length, radius),
    new Vector2(length, -radius),
    new Vector2(0, -radius),
  ];

  return (
    <Line points={cylinderOutlinePoints} color={STEEL_COLOR} lineWidth={2} />
  );
}

function StartingPoint() {
  const { startingPoint, startingPointRef } = useGeometryContext();

  return (
    <Points
      ref={startingPointRef}
      positions={new Float32Array([startingPoint.x, startingPoint.z, 0])}>
      <pointsMaterial size={3} color={'#1976d2'} />
    </Points>
  );
}

export function MaterialShape({ latheState }: MaterialShapeProps) {
  const { cylinderSize, showGeometry } = useGeometryContext();

  if (!cylinderSize.radius || !cylinderSize.length) return;

  return (
    <>
      {showGeometry && (
        <ThreeDView
          radius={cylinderSize.radius}
          length={cylinderSize.length}
          points={latheState}
        />
      )}
      <TwoDView radius={cylinderSize.radius} length={cylinderSize.length} />
      <StartingPoint />
    </>
  );
}
