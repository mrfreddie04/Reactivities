import React, { SyntheticEvent } from "react";
import { observer } from 'mobx-react-lite';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

function FollowButton({profile}: Props) {

  const { profileStore: {isCurrentUser, updateFollowing, loading} } = useStore();

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    updateFollowing(username, !profile.following);
  }

  if(isCurrentUser(profile.username)) return null;    

  //console.log("FollowButton", profile.following);

  return (
    <Reveal animated="move" >
      <Reveal.Content visible style={{width: "100%"}}>
        <Button 
          fluid 
          color="teal" 
          content={ profile.following ? "Following" : "Not following"} 
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{width: "100%"}}>
        <Button 
          fluid 
          basic
          loading={loading}
          color={ profile.following ? "red": "green"}
          content={ profile.following ? "Unfollow": "Follow"} 
          onClick={(e)=>handleFollow(e,profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
}

export default observer(FollowButton);        