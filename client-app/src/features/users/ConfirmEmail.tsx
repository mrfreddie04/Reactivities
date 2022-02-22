import React, { useEffect, useState } from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useQuery } from '../../app/common/util/hooks';
import { useStore } from '../../app/stores/store';
import agent from '../../app/api/agent';
import { history } from "../../index";
import LoginForm from "./LoginForm";

enum Status {
  Verifying = "Verifying",
  Failed = "Failed",
  Success = "Success"
}
type StatusStrings = keyof typeof Status;

function ConfirmEmail() {
  const { modalStore: { openModal } } = useStore();  
  const email = useQuery().get("email") as string;
  const token = useQuery().get("token") as string;

  const [status, setStatus] = useState<StatusStrings>(Status.Verifying);

  useEffect(() => {
    // console.log(email);
    // console.log(token);
    agent.Account.verifyEmail(token,email).then(() => {
      setStatus(Status.Success);
    }).catch((err)=>{
      setStatus(Status.Failed);
    });
  },[token,email]);

  const handleConfirmEmailResend = () => {
    agent.Account.ResendEmailConfirm(email).then(()=>{
      toast.success("Verification email resent - please check your email")
    }).catch((err)=>{
      console.log(err);
    });
  }

  const handleLogin = () => {
    history.push("/");
    openModal(<LoginForm/>);
  }

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Veryfying...</p>
      case Status.Success:
        return (
          <div>
            <p>Email has been confirmed. You can now loging</p> 
            <Button onClick={handleLogin} primary content="Login" size="huge"/>
          </div>);   
      case Status.Failed:
        return (
          <div>
            <p>Verification failed. You can try resending the verify link to your email</p> 
            <Button onClick={handleConfirmEmailResend} primary content="Resend email" size="huge"/>
          </div>);          
    }
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon color="green" >
        <Icon name="envelope"/>
        Email verification
      </Header>
      <Segment.Inline>
        { getBody() }
      </Segment.Inline>
    </Segment>
  );
}

export default ConfirmEmail;