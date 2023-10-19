import { useLocation, useNavigate, useParams } from '@reach/router';
import React from 'react';

export const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return <WrappedComponent {...props} params={params} location={location} navigate={navigate} />;
};
