import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from "./ProfileEditForm";

function ProfileAbout() {
  const { profileStore: {profile, isCurrentUser}} = useStore();

  const [editAboutMode, setEditAboutMode] = useState<boolean>(false);

  const handleFormSubmit = () => {
    setEditAboutMode(false);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={`About ${profile?.displayName}`} />
          {isCurrentUser && (
            <Button 
              floated = "right" 
              basic 
              content = {editAboutMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditAboutMode(!editAboutMode)}
          />)}
        </Grid.Column>
        <Grid.Column width={16}>
          { editAboutMode 
            ? (<ProfileEditForm onSubmit={handleFormSubmit}/>)
            : (<span style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</span>)
          }
        </Grid.Column>
      </Grid>
      
    </Tab.Pane>
  );
}  

export default ProfileAbout;