import React, { SyntheticEvent } from 'react'
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
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string;
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
  deleteActivity,
  submitting,
  target
}) => {

  return (
    <Grid>
        <Grid.Column width={10}>
            <ActivityList 
              activities={activities} 
              selectActivity={selectActivity}  
              deleteActivity={deleteActivity}     
              submitting={submitting}  
              target={target}   
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
                submitting={submitting}
                
            />}
        </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard