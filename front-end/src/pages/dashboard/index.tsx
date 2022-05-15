import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserSessions } from 'store/user/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Dashboard = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [gettingUserSession, setGettingUserSession] = useState(false);

  const { accessToken, emailConfirmed } = props.auth;
  useEffect(() => {
    if (!accessToken) navigate('/login');
    else if (!emailConfirmed) navigate('/request-activate-email');
    else if (!gettingUserSession) {
      setGettingUserSession(true);
      dispatch(getUserSessions());
      dispatch(openHeader());
    }
  }, [gettingUserSession, accessToken, emailConfirmed, dispatch, navigate]);

  return <div></div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
