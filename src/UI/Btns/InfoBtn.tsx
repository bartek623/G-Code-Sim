import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

type InfoBtnProps = {
  onClick: () => void;
};

export function InfoBtn({ onClick }: InfoBtnProps) {
  return (
    <Tooltip title="More info">
      <IconButton aria-label="more info" onClick={onClick}>
        <InfoOutlined />
      </IconButton>
    </Tooltip>
  );
}
