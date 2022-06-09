import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import ActivitiesDetails from '../details/ActivitiesDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

const ActivityDashboard : React.FC = () => {

  // Activity store variable
  const activityStore = useContext(ActivityStore);
  // Destructure store props for usage
  const {editMode, selectedActivity} = activityStore;

  return (
    <Grid>
        <Grid.Column width={10}>
            <ActivityList/>          
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editMode && (
          <ActivitiesDetails />
          )}
          {editMode && 
            <ActivityForm 
                key={selectedActivity && selectedActivity.id || 0}             
                activity={selectedActivity!}                
            />}
        </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)