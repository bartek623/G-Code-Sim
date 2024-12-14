import { LineDataType, LINE_TYPE, PointType, LineType } from '@utils';
import { ERROR_MSG, GCODE, GCODE_CMD } from './constants';

type LinePropsType = {
  type: LineType | undefined;
  start: { x: number; z: number };
  end: { x: number; z: number };
  center: { x: number | undefined; z: number | undefined };
  counterClockwise: boolean | undefined;
  radius: number | undefined;
  lineNumber: number;
};

type cmdValuesType = {
  x: number;
  z: number;
  r: number;
  i: number;
  k: number;
  n: number;
};

type LineData = { type: LineType; counterClockwise?: boolean };

const getLineType = (code: number): LineData => {
  switch (code) {
    case GCODE.POSITIONING:
      return { type: LINE_TYPE.POSITIONING };
    case GCODE.LINE:
      return { type: LINE_TYPE.LINE };
    case GCODE.ARC:
      return { type: LINE_TYPE.ARC };
    case GCODE.COUNTERCLOCKWISE_ARC:
      return { type: LINE_TYPE.ARC, counterClockwise: true };
    default:
      throw new Error(ERROR_MSG.G);
  }
};

const getCenterWithRadius = (
  radius: number,
  start: PointType,
  end: PointType,
  dir: 1 | -1,
) => {
  const distanceBetweenPointsSquared =
    (end.x - start.x) ** 2 + (end.z - start.z) ** 2;
  const diameterSquared = 4 * radius ** 2;
  const center = { x: 0, z: 0 };

  if (diameterSquared < distanceBetweenPointsSquared) {
    throw new Error(ERROR_MSG.noRsolution);
  } else if (diameterSquared > distanceBetweenPointsSquared) {
    const xMid = (end.x + start.x) / 2;
    const yMid = (end.z + start.z) / 2;

    const sign = (radius / Math.abs(radius)) * dir;

    center.x =
      xMid -
      (radius ** 2 - distanceBetweenPointsSquared / 4) ** 0.5 *
        ((start.z - end.z) / distanceBetweenPointsSquared ** 0.5) *
        sign;
    center.z =
      yMid -
      (radius ** 2 - distanceBetweenPointsSquared / 4) ** 0.5 *
        ((end.x - start.x) / distanceBetweenPointsSquared ** 0.5) *
        sign;
  } else {
    center.x = (end.x + start.x) / 2;
    center.z = (end.z + start.z) / 2;
  }

  return center;
};

const calcCenter = (
  lineProps: LinePropsType,
  prevValues: cmdValuesType,
  warningFn: (msg: string) => void,
) => {
  if (lineProps.center.x === undefined && lineProps.center.z === undefined) {
    if (!lineProps.radius) {
      warningFn(ERROR_MSG.IKRmissing);
      lineProps.radius = prevValues.r;
    }

    const dir = lineProps.counterClockwise ? -1 : 1;
    const calculatedCenter = getCenterWithRadius(
      lineProps.radius,
      lineProps.start,
      lineProps.end,
      dir,
    );
    lineProps.center.x = calculatedCenter.x;
    lineProps.center.z = calculatedCenter.z;
  } else {
    if (lineProps.radius) warningFn(ERROR_MSG.Roverrided);

    if (lineProps.center.x === undefined)
      lineProps.center.x = lineProps.start.x + prevValues.i;
    if (lineProps.center.z === undefined)
      lineProps.center.z = lineProps.start.z + prevValues.k;
  }
};

const readCommands =
  (
    lineProps: LinePropsType,
    prevValues: cmdValuesType,
    warningFn: (msg: string) => void,
  ) =>
  (command: string) => {
    const code = command[0];
    const value = +command.slice(1);

    if (isNaN(value)) throw new Error(ERROR_MSG.invalidValueType);

    switch (code) {
      case GCODE_CMD.N:
        lineProps.lineNumber = prevValues.n = Math.round(value);
        break;
      case GCODE_CMD.G: {
        const lineInfo = getLineType(value);
        lineProps.type = lineInfo.type;
        lineProps.counterClockwise = !!lineInfo.counterClockwise;
        break;
      }
      case GCODE_CMD.X:
        if (value < 0) throw new Error(ERROR_MSG.Xnegative);
        lineProps.end.x = prevValues.x = value;
        break;
      case GCODE_CMD.Z:
        if (value < 0) throw new Error(ERROR_MSG.Znegative);
        lineProps.end.z = prevValues.z = value;
        break;
      case GCODE_CMD.I:
        if (lineProps.type !== LINE_TYPE.ARC) throw new Error(ERROR_MSG.Itype);
        lineProps.center.x = prevValues.i = lineProps.start.x + value;
        break;
      case GCODE_CMD.K:
        if (lineProps.type !== LINE_TYPE.ARC) throw new Error(ERROR_MSG.Ktype);
        lineProps.center.z = prevValues.k = lineProps.start.z + value;
        break;
      case GCODE_CMD.R:
        if (lineProps.type !== LINE_TYPE.ARC) throw new Error(ERROR_MSG.Rtype);
        lineProps.radius = prevValues.r = value;
        break;
      default:
        warningFn(ERROR_MSG.unknownCommand + command);
    }
  };

export const convertProgramToLinesData = (
  program: string,
  warningFn: (msg: string) => void = () => {},
  startingPoint: PointType,
): LineDataType[] | undefined => {
  if (!program.length) return;
  if (program.includes('M')) warningFn(ERROR_MSG.M);

  const programLines = program
    .split('\n')
    .filter((line) => !line.includes('M') && line.trim().length);
  const currentToolPosition: PointType = { ...startingPoint };
  const prevValues = {
    x: 0,
    z: 0,
    r: 0,
    i: 0,
    k: 0,
    n: 0,
  };

  const linesData: LineDataType[] = programLines.map((line) => {
    const lineProps: LinePropsType = {
      type: undefined,
      start: { ...currentToolPosition },
      end: { x: prevValues.x, z: prevValues.z },
      center: { x: undefined, z: undefined },
      counterClockwise: undefined,
      radius: undefined,
      lineNumber: prevValues.n,
    };

    const numberedWarningFn = (msg: string) =>
      warningFn(`[N${lineProps.lineNumber}] ${msg}`);

    const commandLine = line.trim();
    const singleCommands = commandLine.split(' ');

    if (!commandLine.includes('N')) {
      lineProps.lineNumber = prevValues.n =
        Math.ceil((prevValues.n + 1) / 10) * 10;
    }

    try {
      singleCommands.forEach(
        readCommands(lineProps, prevValues, numberedWarningFn),
      );

      if (!lineProps.type) throw new Error(ERROR_MSG.line);

      if (lineProps.type === LINE_TYPE.ARC)
        calcCenter(lineProps, prevValues, numberedWarningFn);

      currentToolPosition.x = lineProps.end.x as number;
      currentToolPosition.z = lineProps.end.z as number;

      if (lineProps.type === LINE_TYPE.ARC) {
        const lineData: LineDataType = {
          type: lineProps.type,
          start: lineProps.start,
          end: lineProps.end,
          center: lineProps.center as PointType,
          counterClockwise: lineProps.counterClockwise,
        };
        return lineData;
      } else if (
        lineProps.type === LINE_TYPE.LINE ||
        lineProps.type === LINE_TYPE.POSITIONING
      ) {
        const lineData: LineDataType = {
          type: lineProps.type,
          start: lineProps.start,
          end: lineProps.end,
        };
        return lineData;
      } else throw new Error(ERROR_MSG.command);
    } catch (err) {
      if (err instanceof Error)
        // throw Error with line number
        throw new Error(`[N${lineProps.lineNumber}] ${err.message}`);
      else throw new Error('Unknown error');
    }
  });

  return linesData;
};

export const addLinesNumbering = (program: string) => {
  let currentLineNumber = 0;
  const withComments = program
    .trim()
    .split('\n')
    .map((line): string => {
      if (line.includes('N')) {
        currentLineNumber =
          Number(/N\w+/.exec(line)?.at(0)?.slice(1)) || currentLineNumber;
        return line;
      } else {
        currentLineNumber = Math.ceil((currentLineNumber + 1) / 10) * 10;
        return `N${currentLineNumber} ${line.trim()}`;
      }
    })
    .join('\n');

  return withComments;
};

export const removeLinesNumbering = (program: string) => {
  const withoutComments = program
    .trim()
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .filter((cmd) => !cmd.includes('N'))
        .join(' '),
    )
    .join('\n');

  return withoutComments;
};
