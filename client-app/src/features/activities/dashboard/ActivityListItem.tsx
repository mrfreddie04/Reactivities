import React from 'react';
import { Segment, Item, Button, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity;
}

function AcivityListItem({ activity }: Props) {

  return (    
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/user.png"/>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by Bob
              </Item.Description>
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
        Attendees go here
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
