import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
import LoadingComponent from '../../../app/layout/LoadingComponent';

function AcivityDashboard() {

  const { activityStore: { loadingInitial, activityRegistry, loadActivities } } = useStore();

  useEffect(() => {
    if(activityRegistry.size <= 1) {
      console.log("loadActivities");
      loadActivities();  
    }
  },[loadActivities,activityRegistry.size]);

  if(loadingInitial)
    return (
      <LoadingComponent content="Loading app..."></LoadingComponent>
    );  

  console.log("Dashboard render");

  return (    
    <Grid columns={1}>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>      
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
}

export default observer(AcivityDashboard);