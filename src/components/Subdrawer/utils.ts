import { SAVED_TYPE, savedKeyType, savedType, savedValuesType } from './types';

const savedKey = 'saved-programs';

// This is saved element by default, created only if local storage was empty
const defaultElement: savedType = {
  title: 'DEFAULT MOCKUP ELEMENT',
  code: 'N10 G00 X176 Z60\nN20 G01 Z48\nN30 G01 X186 Z38\nN40 G01 X219\nN50 G02 X224 Z33 R5\nN60 G01 Z24\nN70 G01 X256\nN80 G00 X384 Z72\n-- REPOSITION --\nN90 G00 X208 Z60\nN100 G01 Z34\nN110 G03 X210 Z32 R2\nN120 G01 X254\nN130 G01 X256 Z30\nN140 G00 X384 Z72',
  date: Date.now(),
};

export const setSavedStorage = (programsToSave: savedType[]) => {
  localStorage.setItem(savedKey, JSON.stringify(programsToSave));
};

export const getSavedStorage = () => {
  const savedString = localStorage.getItem(savedKey);
  const saved: savedType[] = savedString
    ? JSON.parse(savedString)
    : [defaultElement];

  return saved;
};

export const isProgramObjectValid = (
  program: savedType,
  currPrograms: savedType[],
): savedType | undefined => {
  const validProgram: Record<string, savedValuesType> = {};

  for (const key in SAVED_TYPE) {
    const typedKey = key as savedKeyType;
    if (typeof program[typedKey] !== typeof SAVED_TYPE[typedKey])
      return undefined;

    validProgram[typedKey] = program[typedKey];
  }

  if (currPrograms.some((currProgram) => currProgram.title === program.title))
    return undefined;

  return validProgram as savedType;
};

export const readUploadedFile = async (
  file: File,
  currPrograms: savedType[],
) => {
  let skipped = 0;
  const newPrograms = [...currPrograms];

  const data = await file.text();
  const uploadedPrograms: savedType[] = JSON.parse(data);

  uploadedPrograms.forEach((newProgram) => {
    const validProgram = isProgramObjectValid(newProgram, newPrograms);

    if (!validProgram) return ++skipped;

    newPrograms.push(validProgram);
  });

  newPrograms.sort((a, b) => b.date - a.date);

  return { newPrograms, skipped };
};
