import {
  Add,
  FileDownload,
  Folder,
  FormatListNumbered,
  PlayArrow,
  Remove,
  Save,
  SwapHoriz,
  Upload,
  VideoStable,
  ViewInAr,
} from '@mui/icons-material';
import { useGeometryContext, useNotificationsContext } from '@store';
import {
  DrawerBtn,
  DrawerInputContainer,
  ListMenuBtn,
  NOTIFICATION_TYPES,
} from '@UI';
import { STLExporter } from 'three/examples/jsm/Addons.js';
import { SUBDRAWER_MODES, subdrawerModesType } from './constants';

type DrawerBtnsProps = {
  onAddNumbering: () => void;
  onRemoveNumbering: () => void;
  onReposition: () => void;
  onRun: () => void;
  onSubOpen: (mode: subdrawerModesType) => void;
};

export function MainDrawerBtns({
  onAddNumbering,
  onRemoveNumbering,
  onReposition,
  onRun,
  onSubOpen,
}: DrawerBtnsProps) {
  const { geometryRef, setShowGeometry, setShowWorkpiece } =
    useGeometryContext();
  const { pushNotification } = useNotificationsContext();

  const onShowGeo = () => {
    setShowGeometry((prev) => {
      const msg = `${prev ? 'Hiding' : 'Showing'} model`;
      pushNotification({ message: msg, type: NOTIFICATION_TYPES.info });

      return !prev;
    });
  };

  const onShowWorkpiece = () => {
    setShowWorkpiece((prev) => {
      const msg = `${prev ? 'Hiding' : 'Showing'} workpiece`;
      pushNotification({ message: msg, type: NOTIFICATION_TYPES.info });

      return !prev;
    });
  };

  const onSaveHandler = () => {
    onSubOpen(SUBDRAWER_MODES.save);
  };

  const onLoadHandler = () => {
    onSubOpen(SUBDRAWER_MODES.load);
  };

  const onExportSTL = () => {
    if (!geometryRef.current) {
      pushNotification({
        message: 'This action requires 3D view. Please enable it to proceed.',
        type: NOTIFICATION_TYPES.error,
      });
      return;
    }

    const exporter = new STLExporter();
    const result = exporter.parse(geometryRef.current);

    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'GCodeModel.stl';
    link.click();
    link.remove();
  };

  return (
    <DrawerInputContainer padding={1} paddingX={3}>
      <ListMenuBtn
        aria-label="Add/remove lines numbering"
        tooltip="Add/remove lines numbering"
        listItems={[
          {
            action: onAddNumbering,
            icon: <Add />,
            text: 'Add',
          },
          {
            action: onRemoveNumbering,
            icon: <Remove />,
            text: 'Remove',
          },
        ]}>
        <FormatListNumbered />
      </ListMenuBtn>

      <ListMenuBtn
        aria-label="3D model"
        tooltip="3D model"
        listItems={[
          { action: onShowGeo, icon: <ViewInAr />, text: 'Show 3D model' },
          {
            action: onShowWorkpiece,
            icon: <VideoStable />,
            text: 'Toggle workpiece',
          },
          {
            action: onExportSTL,
            icon: <FileDownload />,
            text: 'Export to .stl',
          },
        ]}>
        <ViewInAr />
      </ListMenuBtn>

      <DrawerBtn
        aria-label="Reposition"
        tooltip="Reposition"
        onClick={onReposition}>
        <SwapHoriz />
      </DrawerBtn>

      <ListMenuBtn
        aria-label="Save/load program"
        tooltip="Save/load program"
        listItems={[
          { action: onSaveHandler, icon: <Save />, text: 'Save' },
          { action: onLoadHandler, icon: <Upload />, text: 'Load' },
        ]}>
        <Folder />
      </ListMenuBtn>

      <DrawerBtn aria-label="Run program" tooltip="Run program" onClick={onRun}>
        <PlayArrow />
      </DrawerBtn>
    </DrawerInputContainer>
  );
}
