import React from 'react';

import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
  onOpenForm: () => void;
};

function NavBar({onOpenForm}:Props) {
  // const [activeItem, setActiveItem] = useState<string>(null);

  // const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement,MouseEvent>, { name }: MenuItemProps) => setActiveItem(name)

  return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item
            header
          >
            <img src="/assets/logo.png" alt="logo" style ={{marginRight: "10px"}}></img>
            Reactivities
          </Menu.Item>

          <Menu.Item name='Activities'>
          </Menu.Item>
            
          <Menu.Item>
            <Button positive content="Create Activity" onClick={() => onOpenForm()}></Button>
          </Menu.Item>
        </Container>
      </Menu>
  );
}

export default NavBar;