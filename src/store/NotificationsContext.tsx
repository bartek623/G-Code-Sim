import {
  AUTOHIDE_TIME_RATE,
  MIN_AUTOHIDE_TIME,
  NotificationInfoType,
  SnackbarStateType,
} from '@UI';
import { createContext, ReactNode, useCallback, useRef, useState } from 'react';

export type NotificationsContextType = {
  pushNotification: (notification: NotificationInfoType) => void;
  hideNotification: () => void;
  snackbarState: SnackbarStateType;
};

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

type NotificationsStoreProps = {
  children: ReactNode | ReactNode[];
};

export const NotificationsStore = ({ children }: NotificationsStoreProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    type: 'success',
  });

  const hideNotification = (
    _?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return;

    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const pushNotification = useCallback((notification: NotificationInfoType) => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        hideNotification();
      },
      MIN_AUTOHIDE_TIME + AUTOHIDE_TIME_RATE * notification.message.length,
    );

    setSnackbarState({ ...notification, open: true });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ pushNotification, hideNotification, snackbarState }}>
      {children}
    </NotificationsContext.Provider>
  );
};
