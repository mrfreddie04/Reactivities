import React from 'react';
import { observer } from 'mobx-react-lite';
import { Image, Card, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
//import { useStore } from "../../../app/stores/store";
import { Profile } from '../../app/models/profile';

interface Props {
  profile: Profile;
}

function ProfileCard({ profile }: Props) {

  const bio = profile.bio && profile.bio.length > 40 
    ? `${profile.bio.slice(0,40)}...`
    : profile.bio || "";

  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{bio}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user"/>
        20 followers
      </Card.Content>
    </Card>
  );
}  

export default observer(ProfileCard);

