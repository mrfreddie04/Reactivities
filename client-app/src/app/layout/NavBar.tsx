import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

function NavBar() {

  return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} to="/" exact header>
            <img src="/assets/logo.png" alt="logo" style ={{marginRight: "10px"}}></img>
            Reactivities
          </Menu.Item>

          <Menu.Item as={NavLink} to="/activities" exact name='Activities'>
          </Menu.Item>
            
          <Menu.Item >
            <Button as={NavLink} to="/create-activity" exact 
              positive content="Create Activity" 
            ></Button>
          </Menu.Item>
        </Container>
      </Menu>
  );
}

export default NavBar;