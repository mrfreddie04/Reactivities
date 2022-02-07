import React, {useEffect, Fragment} from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from "./NavBar"
import LoadingComponent from "./LoadingComponent";
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';
import { useStore } from "../stores/store";

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    console.log("loadActivities");
    activityStore.loadActivities();
  },[activityStore]);

  if(activityStore.loadingInitial)
    return (
      <LoadingComponent content="Loading app..."></LoadingComponent>
    );

  console.log("App render");

  return (
    <Fragment>
      <NavBar/>
      <Container style={{marginTop: "7rem"}}>    
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
