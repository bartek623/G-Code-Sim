import { ValuesType } from "../../utils/types";

export const TEXT_FIELD_BACKGROUND = "#282c34";
export const TEXT_FIELD_COLOR = "#abb2bf";

export const GCODE_CMD = {
  G: "G",
  X: "X",
  Y: "Y",
  I: "I",
  J: "J",
} as const;

export const GCODE = {
  POSITIONING: "00",
  LINE: "01",
  ARC: "02",
  COUNTERCLOCKWISE_ARC: "03",
} as const;

export const MAINDRAWER_LABEL = "GCodeSim";

export const SUBDRAWER_MODES = {
  save: "save",
  load: "load",
  none: "none",
} as const;

export type subdrawerModesType = ValuesType<typeof SUBDRAWER_MODES>;

export const SUBDRAWER_LABEL: Record<subdrawerModesType, string> = {
  save: "Save your program",
  load: "Load saved program",
  none: "",
};

export type subdrawerState = {
  open: boolean;
  mode: subdrawerModesType;
};

export const SUBDRAWER_DEFAULT: subdrawerState = {
  open: false,
  mode: SUBDRAWER_MODES.none,
};
