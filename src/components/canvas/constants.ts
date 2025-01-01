import { Euler, Vector3 } from '@react-three/fiber';

export const AMBIENT_LIGHT_INTENSITY = 0.6;
export const DEFAULT_CAMERA_POS: Vector3 = [0, 0, 256];
export const DIRECT_LIGHT_POS: Vector3 = [-1, 1, 3];
export const DIRECT_LIGHT_POS2: Vector3 = [1, -2, -3];
export const GRID_ROTATION: Euler = [Math.PI * 0.5, 0, 0];
export const GRID_POSITION: Vector3 = [0, 0, -0.001];
export const GRID_CELL_SIZE = 8;
export const GRID_CELL_THICKNESS = 1;
export const GRID_SECTION_SIZE = 1024;
export const GRID_FADE_STRENGTH = 0;
export const GRID_FADE_DISTANCE = 2000;

export const DARK_GREY = '#777';
export const LIGHT_GREY = '#ddd';
export const RED = 'red';

export const CURVE_POINTS = 50;
export const DASH_SIZE = 4;
export const GAP_SIZE = 2;
export const LINE_ANIMATION_RATE = 400;
export const LINE_COLOR = 'crimson';
export const POSITION_LINE_COLOR = 'royalblue';

export const STEEL_COLOR = '#888';

export const GEO_ROTATIONS = 100;
export const TRANSPARENT_MATERIAL_OFFSET = 5;
export const TRANSPARENT_MATERIAL_OPACITY = 0.5;
