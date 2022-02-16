import React, { useEffect } from "react";
//import { useParams } from "react-router-dom";
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../app/stores/store";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { username } = useParams<{username:string}>();

  const { profileStore: {profile, loadingProfile, loadProfile}} = useStore();

  //console.log("ProfilePage", username);

  useEffect(() => {
    if(username) {
      //console.log("ProfilePage loading", username);
      loadProfile(username);
    }
  },[username, loadProfile]);

  if(loadingProfile)
    return (
      <LoadingComponent content="Loading profile..."></LoadingComponent>
    );    

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile &&
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} /> 
          </>
        }               
      </Grid.Column>
    </Grid>
  );
}

export default observer(ProfilePage);
