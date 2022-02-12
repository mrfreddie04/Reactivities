import React from 'react'
import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import { Activity } from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

function ActivityDetailedHeader({activity}: Props) {
  const { 
    activityStore: { loading, updateAttendance, cancelActivityToggle }
  } = useStore();

  const handleUpdateAttendance = () => {  
    updateAttendance();
  }  

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{padding: '0'}}>
        {activity.isCancelled && 
          <Label style={{position: "absolute", zIndex:"1000", left:"-14px", top:"20px"}}
            ribbon color="red" content="Cancelled"
          ></Label>
        }
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{color: 'white'}}
                />
                <p>{format(activity.date!, "P")}</p>
                <p>
                  Hosted by <Link to={`/profiles/${activity.host?.username}`}><strong>{activity.host?.displayName}</strong></Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {!activity.isHost && !activity.isGoing && (
          <Button 
            loading={loading} 
            color='teal' onClick={handleUpdateAttendance}
            disabled={activity.isCancelled}
          >Join Activity</Button>
        )}
        {!activity.isHost && activity.isGoing && (
          <Button 
            loading={loading} 
            onClick={handleUpdateAttendance}
          >Cancel attendance</Button>
        )}   
        {activity.isHost && (
          <>
            <Button 
              loading={loading}
              color={activity.isCancelled ? "green" : "red"} 
              floated="left" 
              basic
              content={activity.isCancelled ? "Re-activate Event" : "Cancel Event"} 
              onClick={()=>cancelActivityToggle(activity.id)}
            />
            <Button 
              disabled={activity.isCancelled}
              as={Link} 
              to={`/manage-activity/${activity.id}`} 
              color='orange' 
              floated='right'>
                Manage Event
            </Button>
          </>
        )}
      </Segment>
    </Segment.Group>
  )
};

export default observer(ActivityDetailedHeader);