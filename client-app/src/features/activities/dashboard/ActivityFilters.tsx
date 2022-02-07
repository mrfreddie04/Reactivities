import React, { Fragment } from 'react'
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';

function ActivityFilters() {

  return (    
    <Fragment>
      <Menu vertical size="large" style={{width: '100%', marginTop: "29px"}}>
        <Header icon="filter" attached color="teal" content="Filters"/>
        <Menu.Item content="All Activities" />
        <Menu.Item content="I'm going" />
        <Menu.Item content="I'm hosting" />
      </Menu>
      <Header/>
      <Calendar></Calendar>
    </Fragment>    
  );
}

export default ActivityFilters;  