import React, { Fragment } from 'react'
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';
import { Header, Menu } from 'semantic-ui-react';
import { useStore } from "../../../app/stores/store";

function ActivityFilters() {

  const {activityStore: {predicate, setPredicate}} = useStore();

  return (    
    <Fragment>
      <Menu vertical size="large" style={{width: '100%', marginTop: "29px"}}>
        <Header icon="filter" attached color="teal" content="Filters"/>
        <Menu.Item 
          content="All Activities" 
          active={predicate.get("all")}
          onClick={()=>setPredicate("all",true)}
        />
        <Menu.Item 
          content="I'm going" 
          active={predicate.get("isGoing")}
          onClick={()=>setPredicate("isGoing",true)}
        />
        <Menu.Item 
          content="I'm hosting"
          active={predicate.get("isHost")}
          onClick={()=>setPredicate("isHost",true)}          
         />
      </Menu>
      <Header/>
      <Calendar
        onChange={(value:Date)=>setPredicate("startDate",value)}
        value={predicate.get("startDate") || new Date()}
      />
    </Fragment>    
  );
}

export default observer(ActivityFilters);  