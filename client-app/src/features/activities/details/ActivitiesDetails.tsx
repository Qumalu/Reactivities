import React from 'react'
import { Button, Card, Icon, Image } from 'semantic-ui-react'
import { IActivitiy } from '../../../app/models/activitiy';

interface IProps {    
    activity: IActivitiy;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivitiy | null) => void;
}

const ActivitiesDetails : React.FC<IProps> = ({activity, setEditMode, setSelectedActivity}) => {
  return (
    <Card fluid>
        <Image src={`/assets/categoryImages/${activity?.category}.jpg`} wrapped ui={false} />
        <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
            <span>{activity.date.toString()}</span>
        </Card.Meta>
        <Card.Description>
            {activity.description}
        </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button.Group widths={2}>
                <Button 
                    onClick={() => setEditMode(true)} 
                    basic 
                    color='blue' 
                    content='Edit'
                />
                <Button 
                    onClick={() => setSelectedActivity(null)}
                    basic 
                    color='grey' 
                    content='Cancel'
                />            
            </Button.Group>
        </Card.Content>
    </Card>
  )
}

export default ActivitiesDetails