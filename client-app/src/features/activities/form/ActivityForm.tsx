import React, { useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";
import { Link, useHistory, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import LoadingComponent from '../../../app/layout/LoadingComponent';

function AcivityForm() {
  const history = useHistory();
  const { activityStore: {loadingInitial, loading, loadActivity, createActivity, updateActivity } } = useStore();
  const { id } = useParams<{id:string}>();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
  });

  useEffect(() => {
    if(id) {
      loadActivity(id).then((activity)=>{
        if(activity) setActivity(activity);
      });
    }
  },[id, loadActivity]);

  if(loadingInitial)
    return (
      <LoadingComponent content="Loading activity..."></LoadingComponent>
    );  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
  
    if(!activity.id) {
      createActivity(activity).then((activity) => history.push(`/activities/${activity!.id}`)); 
    } else {
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`)); 
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity({...activity,[name]:value})
  }

  const handleCancel = () => {
    return activity.id ? `/activities/${activity.id}` : "/activities";
  } 

  console.log("Form render");

  return (    
    <Segment clearing>
      <Form onSubmit={handleSubmit} onChange={handleInputChange} autoComplete="off" >
        <Form.Input placeholder="Title" name="title" value={activity.title}></Form.Input>
        <Form.TextArea placeholder="Description" name="description" value={activity.description}></Form.TextArea>
        <Form.Input placeholder="Category" value={activity.category} name="category"></Form.Input>
        <Form.Input type="date" placeholder="Date" value={activity.date} name="date"></Form.Input>
        <Form.Input placeholder="City" value={activity.city} name="city"></Form.Input>
        <Form.Input placeholder="Venue" value={activity.venue} name="venue"></Form.Input>
        <Button loading={loading} floated="right" positive content="Submit" type="submit"></Button>
        <Button as={Link} to={handleCancel()}
          floated="right" content="Cancel" type="button"
        ></Button>
      </Form>
    </Segment>
  );
}

export default observer(AcivityForm);