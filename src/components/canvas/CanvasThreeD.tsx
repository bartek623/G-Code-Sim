import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ResetBtn } from '@UI';
import { useRef, useState } from 'react';

import { Vector2 } from 'three';
import { CanvasSetup } from './CanvasSetup';
import { DEFAULT_CAMERA_POS } from './constants';
import { LineElementMemo } from './LineElement';
import { MaterialShape } from './MaterialShape';
import { useGeometryContext } from '@/store';

export type LatheDispatchType = {
  type: 'add' | 'clear';
  payload?: Vector2;
};

export default function CanvasThreeD() {
  const { lines, cylinderSize } = useGeometryContext();
  const cameraControlsRef = useRef<CameraControls>(null!);
  const [latheState, setLatheState] = useState<Vector2[]>([]);

  const cameraResetHandler = () => {
    cameraControlsRef.current.reset(true);
  };

  return (
    <>
      <Canvas camera={{ position: DEFAULT_CAMERA_POS }}>
        <CanvasSetup cameraControlsRef={cameraControlsRef} />
        <LineElementMemo
          updateLathePoints={setLatheState}
          linesData={lines}
          cylinderSize={cylinderSize}
        />
        <MaterialShape latheState={latheState} />
      </Canvas>
      <ResetBtn onClick={cameraResetHandler} />
    </>
  );
}
