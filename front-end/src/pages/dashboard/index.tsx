import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Dashboard = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accessToken, emailConfirmed } = props.auth;
  useEffect(() => {
    if (!accessToken) navigate('/login');
    else if (!emailConfirmed) navigate('/request-activate-email');
    else dispatch(openHeader());
  }, [accessToken, emailConfirmed, navigate, dispatch]);

  return <div></div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
