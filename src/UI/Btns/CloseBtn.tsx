import { Close } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';

type CloseBtnProps = IconButtonProps & {
  onClose: () => void;
};

export function CloseBtn({ onClose, ...restProps }: CloseBtnProps) {
  return (
    <IconButton aria-label="close" onClick={onClose} {...restProps}>
      <Close />
    </IconButton>
  );
}
