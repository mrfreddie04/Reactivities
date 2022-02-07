import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from "../../../app/stores/store";

function AcivityDetails() {
  const { activityStore: { setOpenForm, cancelSelectedActivity, selectedActivity: activity} } = useStore();

  console.log("Details render");

  if(!activity)
    return null;

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
          <Button basic color='blue' content="Edit" onClick={() => setOpenForm(activity.id)}></Button>
          <Button basic color='grey' content="Cancel" onClick={cancelSelectedActivity}></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
}

export default AcivityDetails;
