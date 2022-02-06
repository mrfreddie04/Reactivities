import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  editMode: boolean;
  onSelectActivity: (id: string) => void;
  onCancelSelectActivity: () => void;
  onOpenForm: (id: string) => void;
  onCloseForm: () => void;
  onCreateOrEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
};

function AcivityDashboard({
    activities, selectedActivity, editMode, 
    onSelectActivity, onCancelSelectActivity, onOpenForm, onCloseForm, onCreateOrEditActivity, onDeleteActivity
  }: Props) {
  return (    
    <Grid columns={1}>
      <Grid.Column width="10">
        <ActivityList 
          activities={activities} 
          onSelectActivity={onSelectActivity}     
          onDeleteActivity={onDeleteActivity}     
        />
      </Grid.Column>      
      <Grid.Column width="6">
        { selectedActivity && !editMode && <ActivityDetails 
          activity={selectedActivity}
          onCancelSelectActivity={onCancelSelectActivity}
          onOpenForm={onOpenForm}
        />}  
        { editMode &&
        <ActivityForm 
          activity={selectedActivity}
          onCloseForm={onCloseForm}
          onCreateOrEditActivity={onCreateOrEditActivity}
        />}
      </Grid.Column>
    </Grid>
  );
}

export default AcivityDashboard;