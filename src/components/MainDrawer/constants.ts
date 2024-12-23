import { ValuesType } from '@utils';

export const TEXT_FIELD_BACKGROUND = '#282c34';
export const TEXT_FIELD_COLOR = '#abb2bf';

export const GCODE_CMD = {
  G: 'G',
  X: 'X',
  Z: 'Z',
  I: 'I',
  K: 'K',
  R: 'R',
  N: 'N',
  M: 'M',
} as const;

export const CUSTOM_CMD = {
  REPOSITION: '-- REPOSITION --',
} as const;

export const GCODE = {
  POSITIONING: 0,
  LINE: 1,
  ARC: 2,
  COUNTERCLOCKWISE_ARC: 3,
} as const;

export const MAINDRAWER_LABEL = 'GCodeSim';

export const SUBDRAWER_MODES = {
  save: 'save',
  load: 'load',
  none: 'none',
} as const;

export type subdrawerModesType = ValuesType<typeof SUBDRAWER_MODES>;

export const SUBDRAWER_LABEL: Record<subdrawerModesType, string> = {
  save: 'Save your program',
  load: 'Load saved program',
  none: '',
};

export type subdrawerState = {
  open: boolean;
  mode: subdrawerModesType;
};

export const SUBDRAWER_DEFAULT: subdrawerState = {
  open: false,
  mode: SUBDRAWER_MODES.none,
};

export const ERROR_MSG = {
  G: 'Invalid G code. Please use a valid G code for the machining operation.',
  M: 'M codes are not supported and may result in incomplete simulation.',
  line: 'Incorrect command line format. Ensure that a valid G code is specified.',
  Xnegative:
    "'X' value must be non-negative. Please provide valid, positive coordinates.",
  Znegative:
    "'Z' value must be non-negative. Please provide valid, positive coordinates.",
  Itype: "'I' argument is only applicable for arc commands (G02 or G03).",
  Ktype: "'K' argument is only applicable for arc commands (G02 or G03).",
  Rtype: "'R' argument is only applicable for arc commands (G02 or G03).",
  IKRmissing:
    "Missing argument 'I' and 'K' or 'R'. 'R' from the previous line will be utilized as a substitute.",
  command:
    'Unable to process the command. Check the command syntax and try again.',
  noRsolution:
    "No solution for the provided 'R' argument. The distance between points is longer than the diameter of the circle.",
  Roverrided: "'R' argument overridden by 'I' and 'K'.",
  unknownCommand: 'Unknown command: ',
  invalidValueType: 'Please enter a valid number.',
};
