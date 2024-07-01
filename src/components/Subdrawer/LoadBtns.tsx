import { ChangeEvent, useState } from "react";
import { Delete, Download, UploadFile } from "@mui/icons-material";
import {
  DrawerBtn,
  DrawerBtnContainer,
  NOTIFICATION_TYPES,
  NotificationInfoType,
} from "../../UI";
import { readUploadedFile } from "./utils";
import { savedType } from "./types";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type LoadBtnsProps = {
  pushNotification: (notification: NotificationInfoType) => void;
  updatePrograms: (programs: savedType[]) => void;
  currentPrograms: savedType[];
};

export function LoadBtns({
  pushNotification,
  updatePrograms,
  currentPrograms,
}: LoadBtnsProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const openDialogHandler = () => {
    setOpenDialog(true);
  };
  const closeDialogHandler = () => {
    setOpenDialog(false);
  };

  const deleteAllHandler = () => {
    updatePrograms([]);
    pushNotification({
      message: `All programs removed successfully`,
      type: NOTIFICATION_TYPES.success,
    });
    closeDialogHandler();
  };

  const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const { newPrograms, skipped } = await readUploadedFile(
      e.target.files[0],
      currentPrograms
    );
    updatePrograms(newPrograms);

    if (skipped)
      pushNotification({
        message: `${skipped} ${
          skipped > 1 ? "elements have" : "element has"
        } been skipped during processing. Please review and ensure all elements are valid and names are unique.`,
        type: NOTIFICATION_TYPES.warning,
      });
    else
      pushNotification({
        message: `All elements have been successfuly uploaded.`,
        type: NOTIFICATION_TYPES.success,
      });

    e.target.value = "";
  };

  return (
    <>
      <DrawerBtnContainer>
        <DrawerBtn
          tooltip="Delete all programs"
          color="error"
          onClick={openDialogHandler}
        >
          <Delete />
        </DrawerBtn>

        <DrawerBtn
          tooltip="Upload saved programs from JSON file"
          component="label"
        >
          <UploadFile />
          <input type="file" accept=".json" hidden onChange={uploadHandler} />
        </DrawerBtn>

        <DrawerBtn
          tooltip="Download saved programs to JSON file"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(currentPrograms)
          )}`}
          download="GCodePrograms.json"
        >
          <Download />
        </DrawerBtn>
      </DrawerBtnContainer>

      <Dialog open={openDialog} onClose={closeDialogHandler}>
        <DialogTitle>
          Are you sure you want to remove all saved programs?
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeDialogHandler}>Cancel</Button>
          <Button onClick={deleteAllHandler}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
