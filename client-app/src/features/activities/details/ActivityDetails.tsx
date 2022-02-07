import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from "../../../app/stores/store";

function AcivityDetails() {
  const { activityStore: { selectedActivity: activity, loadingInitial, loadActivity} } = useStore();
  const { id } = useParams<{id:string}>();

  useEffect(()=>{
    if(id) {
      console.log("loadActivity");
      loadActivity(id);
    }
  },[loadActivity, id]);

  if(loadingInitial)
    return (
      <LoadingComponent content="Loading activity..."></LoadingComponent>
    );  

  if(!activity)
    return null;

  console.log("Details render");    

  return (    
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths="2">
          <Button as={Link} to={`/manage-activity/${activity.id}`} basic color='blue' content="Edit"></Button>
          <Button as={Link} to="/activities" basic color='grey' content="Cancel"></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
}

export default observer(AcivityDetails);
