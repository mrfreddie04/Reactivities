import React, { Fragment, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

import NavBar from "./NavBar"
import HomePage from "../../features/home/HomePage";
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestErrors';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoadingComponent from './LoadingComponent';
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";

function App() {
  const location = useLocation();
  const { 
    userStore: { getUser },
    commonStore: { setAppLoaded, appLoaded } 
  } = useStore();

  //console.log("App render");
  useEffect(() => {
    getUser().finally(() => setAppLoaded());
  }, [getUser, setAppLoaded]);

  if(!appLoaded) return (<LoadingComponent content="Loading app..."/>);  

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
      <ModalContainer />
      <Route path="/" exact component={HomePage} />
      <Route 
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar/>
            <Container style={{marginTop: "7rem"}}>    
              <Switch>                
                <PrivateRoute path="/activities" exact component={ActivityDashboard} />
                <PrivateRoute path="/activities/:id" exact component={ActivityDetails} />
                <PrivateRoute key={location.key} path={["/create-activity","/manage-activity/:id"]} exact component={ActivityForm} />
                <PrivateRoute path="/profiles/:username" exact component={ProfilePage} />
                <PrivateRoute path="/errors" exact component={TestErrors} />
                <Route path="/server-error" exact component={ServerError} />
                <Route component={NotFound}/>
              </Switch>
            </Container>
          </>
        )}      
      />
    </Fragment>
  );
}

export default observer(App);
