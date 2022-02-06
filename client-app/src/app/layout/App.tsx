import React, {useState, useEffect, Fragment} from 'react';
import axios from "axios";
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from "uuid";
import { Activity } from "../models/activity";
import NavBar from "./NavBar"
import ActivityDashboard  from '../../features/activities/dashboard/ActivityDashboard';


function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities")
      .then(response => {
        //console.log(response.data);
        setActivities(response.data);
        if(response.data.length)
          setSelectedActivity(response.data[0]);
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
    activity.id 
      ? setActivities(activities.map( el => el.id === activity.id? activity : el))
      : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter( activity => activity.id !== id));
    if(selectedActivity && selectedActivity.id === id)
      setSelectedActivity(undefined);
  }

  return (
    <Fragment>
      <NavBar onOpenForm={handleFormOpen}/>
      <Container style={{marginTop: "7rem"}}>        
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          editMode={editMode}
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
