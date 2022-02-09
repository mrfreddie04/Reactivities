import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../app/stores/store";

function ServerError() {

  const { commonStore: {error } } = useStore();

  //console.log("ServerError render");

  return (        
    <Container>
      <Header as="h1" content="Server Error"/>
      <Header sub as="h5" color="red" content={error?.message}/>
      {error?.details &&
        <Segment>
          <Header as="h4" content="Stack trace" color="teal"/>
          <code style={{marginTop:"10px"}}>
            {error.details}
          </code>
        </Segment>
      }
    </Container>
  );
}

export default observer(ServerError);