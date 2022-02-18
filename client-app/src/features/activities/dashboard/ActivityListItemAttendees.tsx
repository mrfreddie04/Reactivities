import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
//import { useStore } from "../../../app/stores/store";
import { Profile } from '../../../app/models/profile';
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

function AcivityListItemAttendees({ attendees }: Props) {

  //const { activityStore } = useStore();
  const style = {border: "solid 2px orange"};

  return (
    <List horizontal>
      {
        attendees.map( attendee => (
            <Popup 
              hoverable 
              key={attendee.username}
              trigger={
                <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                  <Image 
                    size="mini" 
                    bordered
                    style={ attendee.following ? style : null }
                    circular src={attendee.image || '/assets/user.png'}
                  />
                </List.Item>
              }
            >
              <Popup.Content>
                <ProfileCard profile={attendee}/>
              </Popup.Content>
            </Popup>
        ))
      }                
    </List>
  );
}  

export default observer(AcivityListItemAttendees);