import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Snackbar, IconButton, Icon } from '@mui/material';
// import Alert from '@mui/material/Alert';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

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
  const { snackPack, messageInfo, open, vertical, horizontal } = props.snackbar;
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      //   setMessageInfo({ ...snackPack[0] });
      //   setSnackPack((prev) => prev.slice(1));
      //   setOpen(true);

      props.openSnackbar();
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      props.closeSnackbar();
    }
  }, [open, messageInfo, snackPack]);

  const handleClick = (message: string) => () => {
    props.showSnackbar(message);
    // setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.closeSnackbar();
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
        <Alert onClose={handleClose} sx={{ width: '100%' }} severity={messageInfo?.severity}>
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsecutiveSnackBars);
