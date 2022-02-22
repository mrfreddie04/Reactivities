import React from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useQuery } from '../../app/common/util/hooks';
import agent from '../../app/api/agent';

function RegisterSuccess() {
  const email = useQuery().get("email") as string;

  const handleConfirmEmailResend = () => {
    agent.Account.ResendEmailConfirm(email).then(()=>{
      toast.success("Verification email resent - please check your email")
    }).catch((err)=>{
      console.log(err);
    });
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon color="green" >
        <Icon name="check"/>
        Successfully registered
      </Header>
      <p>Please check your email (including junk email) for the verification email</p>
      {email && 
        <>
          <p>Didn't receive the email? Click the below button to resend</p>
          <Button onClick={handleConfirmEmailResend} primary content="Resend email" size="huge"/>
        </>
      }
    </Segment>
  );
}

export default RegisterSuccess;