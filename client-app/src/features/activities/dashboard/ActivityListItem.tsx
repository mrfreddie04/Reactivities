import React from 'react';
import { Segment, Item, Button, Icon, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity } from '../../../app/models/activity';
import ActivityListItemAttendees from "./ActivityListItemAttendees";

interface Props {
  activity: Activity;
}

function AcivityListItem({ activity }: Props) {

  return (    
    <Segment.Group>
      <Segment>
        {activity.isCancelled && 
          <Label style={{textAlign:"center"}}
            attached="top"
            color="red" 
            content="Cancelled"
          ></Label>
        }        
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/user.png" style={{marginBottom: "5px"}}/>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by {activity.host?.displayName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">You are hosting this event</Label>
                </Item.Description>
              )}
              {!activity.isHost && activity.isGoing && (
                <Item.Description>
                  <Label basic color="green">You are going to this event</Label>
                </Item.Description>
              )}              
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock"/> {format(activity.date!, "Pp")}
          <Icon name="marker"/> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees || []}/>
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button 
          as={Link} 
          to={`/activities/${activity.id}`} 
          color="teal" 
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
    /*<Segment>
      <Item>
        <Item.Content>
          <Item.Header as="a">{activity.title}</Item.Header>
          <Item.Meta>{activity.date}</Item.Meta>
          <Item.Description>
            <div>{activity.description}</div>
            <div>{activity.city}, {activity.venue}</div>
          </Item.Description>                
          <Item.Extra>
            <Button as={Link} to={`/activities/${activity.id}`} floated='right' color="blue" content="View" />
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
    </Segment>*/
  );
}

export default observer(AcivityListItem);
