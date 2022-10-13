import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openHeader } from 'store/settings/actions';
import { getKlines } from 'store/bnb/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserSessions } from 'store/user/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Binance = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(openHeader());
    dispatch(getKlines('NEARUSDT', '5m'));
  }, [dispatch, navigate]);
  return <div></div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
