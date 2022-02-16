import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from '../../app/stores/store';

function LoginForm() {
  const { userStore: { login } } = useStore();
  
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required")
  });  

  return(
    <Formik
      initialValues={{email:'', password:'', error: null }}
      validationSchema={validationSchema}
      onSubmit={(value, {setErrors}) => {
        return login(value).catch(error =>setErrors({ error:"Invalid email or password"}) );
      }}
    >
      {({handleSubmit, isSubmitting, dirty }) => { 
        return (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off" > 
          <Header as="h2" content="Login to Reactivities" color="teal" textAlign="center" />
          <MyTextInput placeholder="Email" name="email" type="email" />
          <MyTextInput placeholder="Password" name="password" type="password" />
          <ErrorMessage 
            name="error"
            render={
              (error) => 
                <Label basic color="red" content={error} style={{marginBottom:"10px"}}/>
            }
          />
          <Button 
              loading={isSubmitting}
              disabled={isSubmitting || !dirty} 
              fluid
              positive 
              content="Login" 
              type="submit" />   
        </Form>
      ); }}  
    </Formik>
  )
}  

export default observer(LoginForm);