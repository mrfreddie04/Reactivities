import React, { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";

function AcivityForm() {

  const { activityStore: {selectedActivity, loading, setCloseForm, createActivity, updateActivity } } = useStore();

  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: ""
  };

  const [activity, setActivity] = useState(initialState);
  //console.log("Render", activity, initialState);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    activity.id ? updateActivity(activity) : createActivity(activity); 
    //console.log("Activity",activity);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity({...activity,[name]:value})
  }

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
        <Button floated="right" content="Cancel" type="button" onClick={setCloseForm}></Button>
      </Form>
    </Segment>
  );
}

export default observer(AcivityForm);