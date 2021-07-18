import React, { useParams } from 'react';
//import { connect } from 'react-redux';
import { withRouter } from 'react-router'


import Reset from './resetPass';

export const ResetHook = () => {
    let { hash } = useParams();

    return (
      <Reset hash={hash} />
    );
  }

export default withRouter(ResetHook);