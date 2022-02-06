import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
  onOpenForm: (id: string) => void;
  onCancelSelectActivity: () => void;
};

function AcivityDetails({activity, onCancelSelectActivity, onOpenForm}: Props) {
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
          <Button basic color='blue' content="Edit" onClick={() => onOpenForm(activity.id)}></Button>
          <Button basic color='grey' content="Cancel" onClick={onCancelSelectActivity}></Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
}

export default AcivityDetails;
