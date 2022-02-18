import React, { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
//import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo } from "../../app/models/profile";

enum Command {
  Update,
  Delete
}

interface Target {
  id: string;
  command: Command;
}

//function ProfilePhotos({profile}: Props) {
function ProfilePhotos() {  
  //const images = profile.photos || [];
  const { profileStore: {isCurrentUser, profile, uploading, loading, uploadPhoto, setMainPhoto, deletePhoto }} = useStore();

  const photos = profile?.photos || [];

  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  }

  const handleSetMainPhoto = (e: SyntheticEvent<HTMLButtonElement>, photo: Photo) => {
    setTarget({id: e.currentTarget.name, command: Command.Update});
    setMainPhoto(photo);
  }

  const handleDeletePhoto = (e: SyntheticEvent<HTMLButtonElement>, photo: Photo) => {
    setTarget({id: e.currentTarget.name, command: Command.Delete});
    deletePhoto(photo);
  }  

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser(profile?.username) && (
            <Button floated="right" basic 
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode 
            ? (<PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading}/>)
            : (      
              <Card.Group itemsPerRow={5}>
                { photos.map( photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url}/>
                    {isCurrentUser(profile?.username) &&
                      (
                        <Button.Group fluid width={2}>
                          <Button
                            basic color="green" 
                            content="Main"
                            name={photo.id}
                            disabled={photo.isMain || loading}
                            loading={target?.command === Command.Update && target?.id === photo.id && loading }
                            onClick={(e) => handleSetMainPhoto(e, photo)}
                          />
                          <Button
                            basic color="red" 
                            icon="trash"
                            name={photo.id}
                            disabled={photo.isMain || loading}
                            loading={target?.command === Command.Delete && target?.id === photo.id && loading }
                            onClick={(e) => handleDeletePhoto(e, photo)}
                          />                          
                        </Button.Group>
                      )
                    }
                  </Card>
                  ))
                }               
              </Card.Group>)
          }
        </Grid.Column>
      </Grid>
      
    </Tab.Pane>
  )
}

export default observer(ProfilePhotos);