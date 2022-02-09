import React, { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Formik, Form } from 'formik';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { useStore } from "../../../app/stores/store";
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";

function AcivityForm() {
  const history = useHistory();
  const { activityStore: {loadingInitial, loading, loadActivity, createActivity, updateActivity } } = useStore();
  const { id } = useParams<{id:string}>();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: ""
  });

  //use Yup to create validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required()
  });

  useEffect(() => {
    if(id) {
      loadActivity(id).then((activity)=>{
        if(activity) {
          setActivity(activity);
        }  
      });
    }
  },[id, loadActivity]);

  if(loadingInitial)
    return (
      <LoadingComponent content="Loading activity..."></LoadingComponent>
    );  

  const handleFormSubmit = (activity: Activity) => {  
    if(!activity.id) {
      createActivity(activity).then((activity) => history.push(`/activities/${activity!.id}`)); 
    } else {
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`)); 
    }
  }

  const handleCancel = () => {
    return activity.id ? `/activities/${activity.id}` : "/activities";
  } 

  //we could use this guard to skip rendering the form when activities are being retrieved for editing
  // if(id && !activity.id) 
  //   return null;

  //console.log("Form render", activity);

  return (    
    <Segment clearing>      
      <Formik 
        enableReinitialize 
        validationSchema={validationSchema}
        initialValues={activity} 
        onSubmit={handleFormSubmit}
      >
        {({handleSubmit, isValid, isSubmitting, dirty}) => {
          return (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off" >   
            <Header content="Activity Details" sub color="teal" />
            <MyTextInput placeholder="Title" name="title"/>
            <MyTextArea rows={3} placeholder="Description" name="description" />
            <MySelectInput placeholder="Category" name="category" options={categoryOptions}/>
            <MyDateInput 
              name="date" 
              placeholderText='Date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city"  />
            <MyTextInput placeholder="Venue"  name="venue" />
            <Button 
              loading={loading} 
              disabled={!isValid || isSubmitting || !dirty} 
              floated="right" 
              positive 
              content="Submit" 
              type="submit" />
            <Button 
              as={Link} 
              to={handleCancel()}
              floated="right" 
              content="Cancel" 
              type="button" />
          </Form>
        );}}
      </Formik>

    </Segment>
  );
}

export default observer(AcivityForm);