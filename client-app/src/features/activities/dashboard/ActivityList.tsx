import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

function AcivityList() {

  const { activityStore: {groupedActivities } } = useStore();

  console.log("List render");

  return (        
    <Fragment>
      {groupedActivities.map( ([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {
            activities.map( activity => (
              <ActivityListItem  key={activity.id} activity={activity}/>
            ))
          }            
        </Fragment>            
        )
      )}
    </Fragment>
  );
}

export default observer(AcivityList);
