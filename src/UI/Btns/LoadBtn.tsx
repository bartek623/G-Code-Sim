import { UploadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

type LoadBtnProps = { onClick: () => void };

export function LoadBtn({ onClick }: LoadBtnProps) {
  return (
    <Tooltip title="Load">
      <IconButton color="primary" onClick={onClick}>
        <UploadOutlined />
      </IconButton>
    </Tooltip>
  );
}
