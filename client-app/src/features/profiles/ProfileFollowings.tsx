import React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import ProfileCard from './ProfileCard';

interface Props {
  predicate: string;
}

function ProfileFollowings({predicate}: Props) {
  const { profileStore: {profile, followings, loadingFollowings }} = useStore();

  // useEffect(() => {
  //   loadFollowings(predicate);
  // },[loadFollowings,predicate])

  const header = predicate === "followers" 
    ? `People following ${profile?.displayName}`
    : `People followed by ${profile?.displayName}`;

  //console.log("ProfileFollowings", followings.length);

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={header} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            { followings.map( following =>(
              <ProfileCard profile={following} key={following.username}/>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>      
    </Tab.Pane>
  );
}  

export default observer(ProfileFollowings);