import React from 'react';
import { connect } from 'react-redux';

import { CircularProgress, Backdrop } from '@mui/material';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Loading = (props: Props) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.settings.loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
