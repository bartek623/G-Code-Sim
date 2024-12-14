import { Line } from '@react-three/drei';
import { LINE_COLOR, POSITION_LINE_COLOR } from './constants';
import { LineElementType } from './types';

type LineSegmentProps = {
  line: LineElementType;
};

export function LineSegment({ line }: LineSegmentProps) {
  return (
    <Line
      points={line.points}
      color={line.positioning ? POSITION_LINE_COLOR : LINE_COLOR}
      dashed
      dashSize={0}
      gapSize={line.lineLength}
    />
  );
}
