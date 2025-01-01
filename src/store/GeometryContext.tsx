import { CylinderSizeType, LineDataType, PointType } from '@utils';
import {
  createContext,
  createRef,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { Mesh, Points } from 'three';

const TOOL_STARTING_OFFSET_MULTIPLIER = 1.5;
const WORKPIECE_DEFAULT_RADIUS = 48;
const WORKPIECE_DEFAULT_LENGTH = 256;

const geometryRef = createRef<Mesh>();
const startingPointRef = createRef<Points>();

export type GeometryContextType = {
  showGeometry: boolean;
  setShowGeometry: Dispatch<SetStateAction<boolean>>;
  showWorkpiece: boolean;
  setShowWorkpiece: Dispatch<SetStateAction<boolean>>;
  geometryRef: RefObject<Mesh>;
  lines: LineDataType[];
  setLines: Dispatch<SetStateAction<LineDataType[]>>;
  cylinderSize: CylinderSizeType;
  setRadius: (radius: number) => void;
  setLength: (length: number) => void;
  startingPoint: PointType;
  startingPointRef: RefObject<Points>;
};

export const GeometryContext = createContext<GeometryContextType | undefined>(
  undefined,
);

type GeometryStoreProps = {
  children: ReactNode | ReactNode[];
};

export const GeometryStore = ({ children }: GeometryStoreProps) => {
  const [showGeometry, setShowGeometry] = useState(false);
  const [showWorkpiece, setShowWorkpiece] = useState(true);
  const [cylinderSize, setCylinderSize] = useState({
    radius: WORKPIECE_DEFAULT_RADIUS,
    length: WORKPIECE_DEFAULT_LENGTH,
  });
  const [lines, setLines] = useState<LineDataType[]>([]);

  const setRadius = (radius: number) => {
    setCylinderSize((prev) => ({ ...prev, radius }));
  };
  const setLength = (length: number) => {
    setCylinderSize((prev) => ({ ...prev, length }));
  };

  const startingPoint: PointType = useMemo(() => {
    startingPointRef.current?.geometry.computeBoundingSphere();
    return {
      x: cylinderSize.length * TOOL_STARTING_OFFSET_MULTIPLIER,
      z: cylinderSize.radius * TOOL_STARTING_OFFSET_MULTIPLIER,
    };
  }, [cylinderSize]);

  return (
    <GeometryContext.Provider
      value={{
        geometryRef,
        showGeometry,
        setShowGeometry,
        showWorkpiece,
        setShowWorkpiece,
        lines,
        setLines,
        cylinderSize,
        setRadius,
        setLength,
        startingPoint,
        startingPointRef,
      }}>
      {children}
    </GeometryContext.Provider>
  );
};
