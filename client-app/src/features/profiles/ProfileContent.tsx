import React from "react";
import { Tab } from 'semantic-ui-react';
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import ProfileEvents from "./ProfileEvents";

interface Props {
  profile: Profile;
}

function ProfileContent({profile}: Props) {

  const { profileStore: {setActiveTab}} = useStore();

  const panes = [
    {menuItem: "About", render: () => <ProfileAbout />},
    {menuItem: "Photos", render: () => <ProfilePhotos />}, //profile={profile}
    {menuItem: "Events", render: () => <ProfileEvents />},
    {menuItem: "Followers", render: () => <ProfileFollowings predicate="followers" />},
    {menuItem: "Following", render: () => <ProfileFollowings predicate="following" />}
  ];

  return (
    <Tab 
      menu={{fluid: true, vertical: true}} 
      menuPosition="right" 
      panes={panes}
      onTabChange={(e, data) => {
        if(data.activeIndex && typeof(data.activeIndex) === "number")
          setActiveTab(data.activeIndex);
      }}
    />
  );
}

export default ProfileContent;

