import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from "../../../app/stores/store";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

function AcivityDetails() {
  const { 
    activityStore: { selectedActivity: activity, loadingInitial, loadActivity}
  } = useStore();
  const { id } = useParams<{id:string}>();

  useEffect(()=>{
    if(id) {
      //console.log("loadActivity");
      loadActivity(id);
    }
  },[loadActivity, id]);

  if(loadingInitial)
    return (
      <LoadingComponent content="Loading activity..."></LoadingComponent>
    );  

  if(!activity)
    return null;

  //console.log("Details render");    

  return (    
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={activity} />
      </Grid.Column>
    </Grid>
  );
}

export default observer(AcivityDetails);
