import React, { useState, useEffect, Fragment } from 'react';
import { Container, Header, Icon, Image, List } from 'semantic-ui-react'
import axios from 'axios';
import { IActivitiy } from '../models/activitiy';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {

  const [activities, setActivities] = useState<IActivitiy[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivitiy | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Get first array item from filtered array of activities by id
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivitiy) =>{
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivitiy) =>{
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) =>{
    setActivities([...activities.filter(a => a.id !== id)]);
  };

  useEffect(() => {
    
    axios
        .get<IActivitiy[]>('http://localhost:5000/api/activities')
        .then((response) => {
          let activities: IActivitiy[] = [];
          response.data.forEach(activity => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity);
          })
          
          setActivities(activities)
        });     

  }, []);
  
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
            />
        </Container>
      </Fragment>
    );
}

export default App;
