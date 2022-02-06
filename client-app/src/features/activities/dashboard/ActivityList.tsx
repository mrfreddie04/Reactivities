import React, {useState, useEffect, SyntheticEvent} from 'react';
import { Segment, Item, Button, Label } from 'semantic-ui-react';
import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  submitting: boolean;
  onSelectActivity: (id:string)=>void;
  onDeleteActivity: (id:string)=>void;
};

function AcivityList({activities, submitting, onSelectActivity, onDeleteActivity}: Props) {

  const [target, setTarget] = useState("");

  useEffect(()=>{
    if(!submitting)
      setTarget("");
  },[submitting]);

  const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>,id: string) => {
    //setTarget(e.currentTarget.name);
    setTarget(id);
    onDeleteActivity(id);
  }

  return (    
    <Segment>
      <Item.Group divided>
        {activities.map( activity => {
          return (
            <Item key={activity.id}>
              <Item.Content>
                <Item.Header as="a">{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>{activity.city}, {activity.venue}</div>
                </Item.Description>                
                <Item.Extra>
                  <Button floated='right' color="blue" content="View" 
                    onClick={() => onSelectActivity(activity.id)}>
                  </Button>
                  <Button 
                    floated='right' 
                    color="red" 
                    content="Delete" 
                    name={activity.id}
                    onClick={(e) => handleActivityDelete(e, activity.id)}
                    loading={submitting && target === activity.id}
                  />
                  <Label basic content={activity.category}></Label>
                </Item.Extra>
              </Item.Content>         
            </Item>
          );
        })}
      </Item.Group>
    </Segment>
  );
}

export default AcivityList;
