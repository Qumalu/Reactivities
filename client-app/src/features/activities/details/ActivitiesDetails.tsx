import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';


const ActivitiesDetails : React.FC = () => {
  
    // Activity store variable
    const activityStore = useContext(ActivityStore);
    // Destructure store props for usage
    const {selectedActivity: activity, openEditForm, cancelFormOpen, cancelSelectedActivity} = activityStore;

    return (
    <Card fluid>
        <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
        <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
            <span>{activity!.date.toString()}</span>
        </Card.Meta>
        <Card.Description>
            {activity!.description}
        </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button.Group widths={2}>
                <Button 
                    // This can only be open if there is an activity so we avoid error of null with !s
                    onClick={() => openEditForm(activity!.id)} 
                    basic 
                    color='blue' 
                    content='Edit'
                />
                <Button 
                    onClick={cancelSelectedActivity}
                    basic 
                    color='grey' 
                    content='Cancel'
                />            
            </Button.Group>
        </Card.Content>
    </Card>
  )
}

export default observer(ActivitiesDetails)