import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { useGeometryContext } from '@/store';
import { DrawerInputContainer } from '@/UI';

type MaterialInputsProps = {
  onRun: () => void;
};

export function MaterialInputs({ onRun }: MaterialInputsProps) {
  const { setRadius, setLength, cylinderSize } = useGeometryContext();

  const changeRadiusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRadius(+e.target.value || 0);
    onRun();
  };
  const changeLengthHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(+e.target.value);
    onRun();
  };

  return (
    <DrawerInputContainer padding={1} paddingX={3}>
      <TextField
        fullWidth
        label="Radius"
        onChange={changeRadiusHandler}
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        defaultValue={cylinderSize.radius}
      />
      <TextField
        fullWidth
        label="Length"
        onChange={changeLengthHandler}
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        defaultValue={cylinderSize.length}
      />
    </DrawerInputContainer>
  );
}
