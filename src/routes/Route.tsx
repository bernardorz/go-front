/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { RouteProps as ReactDOMRouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps{
  isPrivate?: boolean;
  component : React.ComponentType;
}

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={() => (isPrivate === !!user ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard' }} />
        // <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard', state: { from: location } }} />
      ))}
    />
  );
};

export default Route;
