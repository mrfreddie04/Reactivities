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

  const { profileStore: {profile, loadingProfile, loadProfile, setActiveTab}} = useStore();

  //console.log("ProfilePage", username);

  useEffect(() => {
    if(username) {
      //console.log("ProfilePage loading", username);
      loadProfile(username);
    }

    //reset active tab to 0 to reset followings observable back to empty array
    return () => setActiveTab(0);
  },[username, loadProfile, setActiveTab]);

  if(loadingProfile)
    return (
      <LoadingComponent content="Loading profile..."></LoadingComponent>
    );    

  //console.log("ProfilePage");  

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
