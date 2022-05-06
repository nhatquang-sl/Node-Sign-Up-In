import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Snackbar, IconButton, Icon } from '@mui/material';
// import Alert from '@mui/material/Alert';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { openSnackbar, closeSnackbar } from 'store/snackbar/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

export interface SnackbarMessage {
  message: string;
  key: number;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ConsecutiveSnackBars = (props: Props) => {
  const dispatch = useDispatch();

  const { snackPack, messageInfo, open } = props.snackbar;
  const vertical = messageInfo?.vertical ?? 'bottom';
  const horizontal = messageInfo?.horizontal ?? 'center';
  const severity = messageInfo?.severity ?? 'info';

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      //   setMessageInfo({ ...snackPack[0] });
      //   setSnackPack((prev) => prev.slice(1));
      //   setOpen(true);

      dispatch(openSnackbar());
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      dispatch(closeSnackbar());
    }
  }, [open, messageInfo, snackPack, dispatch]);

  // const handleClick = (message: string) => () => {
  //   props.showSnackbar(message);
  //   // setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  // };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  const handleExited = () => {
    props.cleanUpSnackbar();
  };

  return (
    <div>
      {/* <Button onClick={handleClick('Message A')}>Show message A</Button>
      <Button onClick={handleClick('Message B')}>Show message B</Button> */}
      <Snackbar
        key={messageInfo?.key}
        anchorOrigin={{ vertical, horizontal }}
        open={props.snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        action={
          <React.Fragment>
            <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleClose} sx={{ width: '100%' }} severity={severity}>
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsecutiveSnackBars);
