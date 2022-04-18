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
  //   const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  //   const [open, setOpen] = useState(false);
  //   const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  useEffect(() => {
    const { snackPack, messageInfo, open } = props.snackbar;
    console.log(snackPack.length, !messageInfo, open);

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
  }, [props.snackbar.open, props.snackbar.messageInfo, props.snackbar.snackPack]);

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
  const { vertical, horizontal } = props.snackbar;
  console.log({ vertical, horizontal });
  return (
    <div>
      <Button onClick={handleClick('Message A')}>Show message A</Button>
      <Button onClick={handleClick('Message B')}>Show message B</Button>
      <Snackbar
        key={props.snackbar.messageInfo ? props.snackbar.messageInfo.key : undefined}
        anchorOrigin={{ vertical, horizontal }}
        open={props.snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        // message={props.snackbar.messageInfo ? props.snackbar.messageInfo.message : undefined}
        action={
          <React.Fragment>
            <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleClose} sx={{ width: '100%' }} severity={props.snackbar.severity}>
          {props.snackbar.messageInfo ? props.snackbar.messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsecutiveSnackBars);
