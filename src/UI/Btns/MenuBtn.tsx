import { Menu } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';

const StyledIconBtn = styled(IconButton)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;

type MenuBtnProps = { onClick: () => void };

export function MenuBtn({ onClick }: MenuBtnProps) {
  return (
    <StyledIconBtn aria-label="menu" onClick={onClick} color="primary">
      <Menu fontSize="large" />
    </StyledIconBtn>
  );
}
