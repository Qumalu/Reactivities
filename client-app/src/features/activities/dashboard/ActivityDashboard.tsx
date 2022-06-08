import React from 'react'
import { Grid, GridColumn, List } from 'semantic-ui-react'
import { IActivitiy } from '../../../app/models/activitiy'
import ActivitiesDetails from '../details/ActivitiesDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface IProps {
    activities: IActivitiy[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivitiy | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivitiy | null) => void;
    createActivity: (activity: IActivitiy) => void;
    editActivity: (activity: IActivitiy) => void;
    deleteActivity: (id: string) => void;
}

const ActivityDashboard : React.FC<IProps> = ({
  activities, 
  selectActivity, 
  selectedActivity, 
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity
}) => {

  return (
    <Grid>
        <Grid.Column width={10}>
            <ActivityList 
              activities={activities} 
              selectActivity={selectActivity}  
              deleteActivity={deleteActivity}          
            />          
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editMode && (
          <ActivitiesDetails 
              activity={selectedActivity} 
              setEditMode={setEditMode}
              setSelectedActivity={setSelectedActivity}
              />
          )}
          {editMode && 
            <ActivityForm 
                key={selectedActivity && selectedActivity.id || 0}
                setEditMode={setEditMode}
                activity={selectedActivity!}
                createActivity={createActivity}
                editActivity={editActivity}
                
            />}
        </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard