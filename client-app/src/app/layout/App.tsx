import React, { Fragment } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import NavBar from "./NavBar"
import HomePage from "../../features/home/HomePage";
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const location = useLocation();

  console.log("App render");

  return (
    <Fragment>
      <Route path="/" exact component={HomePage} />
      <Route 
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar/>
            <Container style={{marginTop: "7rem"}}>            
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" exact component={ActivityDetails} />
              <Route key={location.key} path={["/create-activity","/manage-activity/:id"]} exact component={ActivityForm} />
            </Container>
          </>
        )}      
      />
    </Fragment>
  );
}

export default observer(App);
