import { Button, ButtonProps, Tooltip } from "@mui/material";
import { MouseEvent, ReactNode } from "react";

type BtnProps = ButtonProps & {
  tooltip: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  download?: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
};

export function DrawerBtn({
  children,
  tooltip,
  onClick,
  color = "primary",
  ...restProps
}: BtnProps) {
  return (
    <Tooltip title={tooltip}>
      <Button
        color={color}
        fullWidth
        variant="contained"
        onClick={onClick}
        {...restProps}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
