import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Dashboard = (props: Props) => {
  const navigate = useNavigate();

  const { accessToken, emailConfirmed } = props.auth;
  useEffect(() => {
    if (!accessToken) navigate('/login');
    else if (!emailConfirmed) navigate('/request-activate-email');
    else props.openHeader();
  }, [accessToken, emailConfirmed]);

  return <div></div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
