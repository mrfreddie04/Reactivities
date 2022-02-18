import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useStore } from '../../app/stores/store';

interface Props extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

function PrivateRoute({component: Component, ...routeProps}: Props) {
  const { userStore: { isLoggedIn } } = useStore()

  return (
    <Route 
      {...routeProps}
      render={(props) => isLoggedIn ? <Component {...props}/> : <Redirect to="/" />}
    />
  );
}

export default PrivateRoute;