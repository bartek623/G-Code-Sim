import { TextFieldProps } from '@mui/material';
import { Drawer } from '@UI';
import { RefObject, useState } from 'react';

import {
  SUBDRAWER_LABEL,
  SUBDRAWER_MODES,
  subdrawerState,
} from '../MainDrawer/constants';
import { Load } from './Load/Load';
import { LoadInfoModal } from './Load/LoadInfoModal';
import { Save } from './Save/Save';
import { SaveInfoModal } from './Save/SaveInfoModal';

type SubdrawerProps = {
  state: subdrawerState;
  onClose: () => void;
  textFieldRef: RefObject<TextFieldProps>;
  onRun: () => void;
};

export function Subdrawer({
  state,
  onClose,
  textFieldRef,
  onRun,
}: SubdrawerProps) {
  const [openModal, setOpenModal] = useState(false);

  const openModalHandler = () => {
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
  };

  return (
    <Drawer
      disableRestoreFocus
      label={SUBDRAWER_LABEL[state.mode]}
      onClose={onClose}
      isOpen={state.open}
      onModalOpen={openModalHandler}>
      {state.mode === SUBDRAWER_MODES.save && (
        <>
          <Save
            program={(textFieldRef.current?.value as string).trim()}
            onClose={onClose}
          />
          <SaveInfoModal isOpen={openModal} onClose={closeModalHandler} />
        </>
      )}
      {state.mode === SUBDRAWER_MODES.load && (
        <>
          <Load textFieldRef={textFieldRef} onClose={onClose} onRun={onRun} />
          <LoadInfoModal isOpen={openModal} onClose={closeModalHandler} />
        </>
      )}
    </Drawer>
  );
}
