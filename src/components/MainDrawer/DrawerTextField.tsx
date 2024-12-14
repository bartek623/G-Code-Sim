import { Container, TextField, TextFieldProps, styled } from '@mui/material';
import { RefObject } from 'react';

import { TEXT_FIELD_BACKGROUND, TEXT_FIELD_COLOR } from './constants';

const StyledContainer = styled(Container)`
  height: 100%;
  overflow-y: auto;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100vw;
  }
`;

const StyledTextField = styled(TextField)`
  border-radius: ${({ theme }) => theme.spacing(1)};
  overflow: hidden;

  & label,
  & textarea {
    color: ${TEXT_FIELD_COLOR};
  }
  background-color: ${TEXT_FIELD_BACKGROUND};
  min-height: 100%;

  & div {
    flex: 1 100%;
    align-items: start;
  }
`;

type DrawerTextFieldProps = {
  textFieldRef: RefObject<TextFieldProps>;
};

export function DrawerTextField({ textFieldRef }: DrawerTextFieldProps) {
  return (
    <StyledContainer>
      <StyledTextField
        fullWidth
        inputRef={textFieldRef}
        InputLabelProps={{ shrink: true }}
        multiline
        variant="filled"
        label="GCode Program"
      />
    </StyledContainer>
  );
}
