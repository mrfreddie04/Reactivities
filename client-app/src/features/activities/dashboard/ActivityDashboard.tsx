import React from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

function AcivityDashboard() {

  const { activityStore: { selectedActivity, editMode } } = useStore();

  console.log("Dashboard render");

  return (    
    <Grid columns={1}>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>      
      <Grid.Column width="6">
        { selectedActivity && !editMode && 
          <ActivityDetails />}  
        { editMode &&
          <ActivityForm/>}
      </Grid.Column>
    </Grid>
  );
}

export default observer(AcivityDashboard);