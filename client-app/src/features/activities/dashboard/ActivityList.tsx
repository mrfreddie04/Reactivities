import React, {useState, useEffect, SyntheticEvent} from 'react';
import { Segment, Item, Button, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";

function AcivityList() {

  const { activityStore: {activitiesByDate, loading, deleteActivity, setSelectedActivity} } = useStore();

  const [target, setTarget] = useState("");

  useEffect(()=>{
    if(!loading)
      setTarget("");
  },[loading]);

  const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>,id: string) => {
    //setTarget(e.currentTarget.name);
    setTarget(id);
    deleteActivity(id);
  }

  console.log("List render");

  return (    
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map( activity => {
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
                    onClick={() => setSelectedActivity(activity.id)}>
                  </Button>
                  <Button 
                    floated='right' 
                    color="red" 
                    content="Delete" 
                    name={activity.id}
                    onClick={(e) => handleActivityDelete(e, activity.id)}
                    loading={loading && target === activity.id}
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

export default observer(AcivityList);
