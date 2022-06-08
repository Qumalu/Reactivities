import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container, Header, Icon, Image, List } from 'semantic-ui-react'
import axios from 'axios';
import { IActivitiy } from '../models/activitiy';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


const App = () => {

  // React hooks for getting data into client state
  const [activities, setActivities] = useState<IActivitiy[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivitiy | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittin, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  // Get first array item from filtered array of activities by id
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  // Performing needed action upon opening form for creating Activity
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  // Handler for creating activity
  const handleCreateActivity = (activity: IActivitiy) => {
    setSubmitting(true);
    // Sends post request to API
    agent.Activities.create(activity).then( () => {
      // Update data on client side
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false))
  };

  // Handler for updating activity
  const handleEditActivity = (activity: IActivitiy) => {
    setSubmitting(true);
    // Sends put request to API
    agent.Activities.update(activity).then(() => {
      // Update data on client side
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false))  
  };

  // Handler for deleteing activity
  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    // Sends delete request to API
    agent.Activities.delete(id).then(() => {
      // Update data on client side
      setActivities([...activities.filter(a => a.id !== id)]);
    }).then(() => setSubmitting(false))   
  };

  // React hook for getting list of activities
  useEffect(() => {   
    // Sends a get request to API
    agent.Activities.list()
        .then((response) => {
          // Formating Date in our list of Activities
          let activities: IActivitiy[] = [];
          response.forEach(activity => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity);
          })
          // Passing data to client side useState hook
          setActivities(activities);
        }).then(() => setLoading(false));

  }, []);
  
    if (loading) return <LoadingComponent content='Loading activities...'/>

    return (
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm}/>
        <Container style={{marginTop: '7em'}}>
            <ActivityDashboard 
              activities={activities} 
              selectActivity={handleSelectedActivity}    
              selectedActivity={selectedActivity!}                 
              editMode={editMode}
              setEditMode={setEditMode}      
              setSelectedActivity={setSelectedActivity}
              createActivity={handleCreateActivity}
              editActivity={handleEditActivity}
              deleteActivity={handleDeleteActivity}
              submitting={submittin}
              target={target}
            />
        </Container>
      </Fragment>
    );
}

export default App;
