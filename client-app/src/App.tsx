import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import { List, Header } from 'semantic-ui-react';

interface Activity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
}


function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities")
      .then(response => {
        console.log(response.data);
        setActivities(response.data);
      });
  },[]);

  const renderedActivities = () => { 
    return (
      <List>
        {activities.map( activity => {
          return (
            <List.Item key={activity.id}>
              <List.Icon name='users' />
              <List.Content>{activity.title}</List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities"/>
      {renderedActivities()}
    </div>
  );
}

export default App;
