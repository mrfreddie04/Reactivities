import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { Button, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import MyTextInput from "../../app/common/form/MyTextInput";
import ValidationErrors from "../errors/ValidationErrors";

// interface Register {
//   email: string; 
//   password: string; 
//   displayName: string; 
//   username: string;
//   error: string | string[] | null;
// }

function RegisterForm() {
  const { userStore: { register } } = useStore();
  
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email(),
    password: Yup.string().required("Password is required"),
    displayName: Yup.string().required("Display Name is required"),
    username: Yup.string().required("Username is required"),
  });  

  //const initialValues: Register = {email:'', password:'', displayName:'', username:'', error: null };

  return(
    <Formik
      initialValues={{email:'', password:'', displayName:'', username:'', error: null }}
      validationSchema={validationSchema}
      onSubmit={(value, {setErrors}) => {
        return register(value).catch((errors) =>{
          setErrors({ error: errors });
        });
      }}
    >
      {({handleSubmit, isSubmitting, dirty, isValid, errors }) => { 
        return (
        <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off" > 
          <Header as="h2" content="Sign up to Reactivities" color="teal" textAlign="center" />
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextInput placeholder="Username" name="username" />
          <MyTextInput placeholder="Email" name="email" type="email" />
          <MyTextInput placeholder="Password" name="password" type="password" />
          <ErrorMessage 
            name="error"
            render={
              () => {               
                if(Array.isArray(errors.error))
                {
                  return (<ValidationErrors errors={errors.error as string[]}/>);
                }
                return null;
              }  
            }
          />
          <Button 
              loading={isSubmitting}
              disabled={isSubmitting || !dirty || !isValid} 
              fluid
              positive 
              content="Register" 
              type="submit" />   
        </Form>
      ); }}  
    </Formik>
  )
}  

export default observer(RegisterForm);