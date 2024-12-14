import { DeleteOutline } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

type DeleteBtnProps = { onClick: () => void };

export function DeleteBtn({ onClick }: DeleteBtnProps) {
  return (
    <Tooltip title="Delete">
      <IconButton aria-label="delete" color="error" onClick={onClick}>
        <DeleteOutline />
      </IconButton>
    </Tooltip>
  );
}
