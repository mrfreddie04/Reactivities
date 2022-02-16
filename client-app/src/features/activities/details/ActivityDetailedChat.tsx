import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Segment, Header, Comment, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../../../app/stores/store';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  activityId: string;
}

function ActivityDetailedChat({activityId}: Props) {
  const { commentStore: {comments, createHubConnection, clearComments, addComment} } = useStore();

  const validationSchema = Yup.object({
    body: Yup.string().required("Comment is required")
  });  

  useEffect(() => {
    if(activityId) {
      createHubConnection(activityId);
    }

    return () => {
      clearComments();
    };  
  },[createHubConnection, clearComments, activityId]);

  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{border: 'none'}}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Formik
            onSubmit={(values,{resetForm}) => addComment(values).then(() => resetForm())}
            validationSchema={validationSchema}
            initialValues={{body:""}}
          >
          {({handleSubmit, isValid, isSubmitting, dirty}) => {
            return (
              <Form className="ui form" onSubmit={handleSubmit} >   
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{position:"relative"}}>
                      <Loader active={isSubmitting}/>
                      <textarea                         
                        autoComplete="off"
                        placeholder='Enter you comment (Enter to submit, SHIFT + enter for new line)'
                        rows={2}
                        {...props.field}
                        onKeyPress={(e) => {                          
                          if(e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if(isValid) handleSubmit(); 
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
                {/* <MyTextArea rows={2} placeholder="Add comment" name="body" />
                <Button
                  loading={isSubmitting} 
                  disabled={!isValid || isSubmitting || !dirty}                 
                  content='Add Reply'
                  labelPosition='left'
                  icon='edit'
                  primary
                  type="submit"
                  floated="right"
                />               */}
              </Form>            
            )}
           } 
        </Formik>

        <Comment.Group>
          {comments.map( comment => (
            <Comment key={comment.id}>
              <Comment.Avatar src= {comment.image || '/assets/user.png'} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{whiteSpace:"pre-wrap"}}>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>

  )
};

export default observer(ActivityDetailedChat);

