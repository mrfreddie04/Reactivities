import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
//import { UserActivity } from '../../app/models/userActivity';
import { useStore } from '../../app/stores/store';
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Link } from 'react-router-dom';

// interface Props {
//   events: UserActivity[];
// }

function ProfileEventsList() {

  const { profileStore: {events, loadingEvents}} = useStore();

  if(loadingEvents)
  return (
    <LoadingComponent content="Loading events..."></LoadingComponent>
  );  

  return (
    <Card.Group itemsPerRow={4} >
      { events.map( event => (
      <Card key={event.id} as={Link} to={`/activities/${event.id}`}>
        <Image 
          src={`/assets/categoryImages/${event.category}.jpg`} 
          style={{ minHeight: "100px", objectFit: "cover"}}
        />
        <Card.Content>
          <Card.Header textAlign='center'>{event.title}</Card.Header>
          <Card.Meta textAlign='center'>
            <div>{format(event.date, "do LLL")}</div>
            <div>{format(event.date, "h:mm a")}</div>
          </Card.Meta>          
        </Card.Content>          
      </Card>
      ))
    }               
    </Card.Group>
  );
}

export default observer(ProfileEventsList);

//<Card.Description>{format(event.date, "Pp")}</Card.Description>

