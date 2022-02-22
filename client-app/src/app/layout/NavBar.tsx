import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

function NavBar() {
  const { userStore: { user, isLoggedIn, logout } } = useStore();
  
  return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} to="/" exact header>
            <img src="/assets/logo.png" alt="logo" style ={{marginRight: "10px"}}></img>
            Reactivities
          </Menu.Item>

          {isLoggedIn && (
            <>
              <Menu.Item as={NavLink} to="/activities" exact name='Activities' />

              <Menu.Item as={NavLink} to="/errors" exact name='Test Errors' />
                
              <Menu.Item >
                <Button as={NavLink} to="/create-activity" exact 
                  positive content="Create Activity" 
                ></Button>
              </Menu.Item>
              <Menu.Item position="right">
                <Image src={user?.image || '/assets/user.png' } avatar spaced="right"/>
                <Dropdown pointing='top left' text={user?.displayName}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text='My Profile' icon='user' />
                    <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </>
          )}
        </Container>
      </Menu>
  );
}

export default observer(NavBar);