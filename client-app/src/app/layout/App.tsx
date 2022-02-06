import React, {useState, useEffect, Fragment} from 'react';
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from "uuid";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import NavBar from "./NavBar"
import LoadingComponent from "./LoadingComponent";
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';


function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    agent.Activities.list()
      .then(response=> {
        setActivities(
          response.map( activity => { 
            const [dt] = activity.date.split("T");
            return {...activity, date: dt};
          })
        );  
        if(response.length)
          setSelectedActivity(response[0]);
        setLoading(false);
      });    
  },[]);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find( activity => activity.id === id));
    setEditMode(false);
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
    //if(editMode) handleFormClose();
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }  

  const handleCreateOrEditActivity = (activity: Activity) => {
    setSubmitting(true);

    if(activity.id) {
      agent.Activities.update(activity).then( () => {
        setActivities(activities.map( el => el.id === activity.id? activity : el));
        setSubmitting(false);
        setEditMode(false);
        setSelectedActivity(activity);        
      });      
    }

    if(!activity.id) {
      activity.id = uuid();
      agent.Activities.create(activity).then( () => {
        setActivities([...activities, activity]);
        setSubmitting(false);
        setEditMode(false);
        setSelectedActivity(activity);        
      });      
    }  
  }

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true);
    agent.Activities.delete(id).then( () => {
      setActivities(activities.filter( activity => activity.id !== id));
      setSubmitting(false);
      if(selectedActivity && selectedActivity.id === id)
        setSelectedActivity(undefined);      
    });    
  }

  if(loading)
    return (
      <LoadingComponent content="Loading app..."></LoadingComponent>
    );

  return (
    <Fragment>
      <NavBar onOpenForm={handleFormOpen}/>
      <Container style={{marginTop: "7rem"}}>        
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          editMode={editMode}
          submitting={submitting}
          onSelectActivity={handleSelectActivity} 
          onCancelSelectActivity={handleCancelSelectActivity} 
          onOpenForm={handleFormOpen}
          onCloseForm={handleFormClose}
          onCreateOrEditActivity={handleCreateOrEditActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
