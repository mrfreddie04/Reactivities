import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../../app/stores/store';
import { Button, Segment } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';
import ValidationErrors from "../errors/ValidationErrors";

interface Props {
  onSubmit: () => void;
}

function ProfileEditForm({onSubmit}: Props) {
  const { profileStore: {profile, updateProfile}} = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required("Display Name is required")
  });  

  return (
    <Segment clearing>      
      <Formik 
        enableReinitialize 
        validationSchema={validationSchema}
        initialValues={{displayName: profile?.displayName ?? "", bio: profile?.bio ?? "", error: null}}            
        onSubmit={(values, {setErrors}) => {
          return updateProfile(values)
            .then( () => onSubmit())
            .catch(errors =>setErrors({ error:errors}) );
        }}
      >
        {({handleSubmit, isValid, isSubmitting, dirty, errors}) => {
          return (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off" >   
            <MyTextInput placeholder="Display Name" name="displayName"/>
            <MyTextArea rows={3} placeholder="Bio" name="bio" />
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
              disabled={!isValid || isSubmitting || !dirty} 
              floated="right" 
              positive 
              content="Update Profile" 
              type="submit" />
          </Form>
        );}}
      </Formik>

    </Segment>
  );
}  

export default ProfileEditForm;