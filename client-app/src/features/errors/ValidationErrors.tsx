import React from 'react';
import { Message } from "semantic-ui-react";

interface Props {
  errors: string[] | null;
}

function ValidationErrors({errors}: Props) {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map( (error:string, idx) => (
            <Message.Item key={idx}>
              {error}
            </Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
}  

export default ValidationErrors;