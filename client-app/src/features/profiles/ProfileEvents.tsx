import React, { useEffect } from 'react';
import { Grid, Header, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import ProfileEventsList from "./ProfileEventsList";

function ProfileEvents() {
  const { profileStore: {loadEvents}} = useStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const panes = [
    {
      menuItem: 'Future Events',
      pane: {key: "future"},
      render: () => <ProfileEventsList/>,
    },
    {
      menuItem: 'Past Events',
      pane: {key: "past"},
      render: () => <ProfileEventsList/>,
    },
    {
      menuItem: 'Hosting',
      pane: {key: "hosting"},
      render: () => <ProfileEventsList/>,
    },
  ]  

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content="Activities" />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab 
            menu={{ secondary: true, pointing: true }} 
            panes={panes}
            onTabChange={(e, data) => {
              loadEvents(panes[data.activeIndex as number].pane.key);
            }}
          />
        </Grid.Column>
      </Grid>
      
    </Tab.Pane>
  );
}  

export default observer(ProfileEvents);