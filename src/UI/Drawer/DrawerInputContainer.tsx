import { Stack, StackProps } from '@mui/material';
import { ReactNode } from 'react';

type DrawerInputContainerProps = StackProps & {
  children: ReactNode | ReactNode[];
};

export function DrawerInputContainer({
  children,
  ...restProps
}: DrawerInputContainerProps) {
  return (
    <Stack direction="row" spacing={0.4} marginTop="auto" {...restProps}>
      {children}
    </Stack>
  );
}
