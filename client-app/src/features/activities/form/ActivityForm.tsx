import React, {FormEvent, useContext, useState} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivitiy } from '../../../app/models/activitiy';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProps{   
    activity: IActivitiy;          
}

const ActivityForm : React.FC<IProps> = ({    
        activity: initialFormState             
       
    }) => {
    
    // Activity Data Store variable 
    const activityStore = useContext(ActivityStore);
     // Destructure store props for usage
    const {createActivity, editActivity, submitting, cancelFormOpen} = activityStore;

    const initializeForm = () => {
        if(initialFormState)
            return initialFormState
        else
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''            
        };
    };
  
    const [activitiy, setActivity] = useState<IActivitiy>(initializeForm);

    const handleSubmit =() => {
        if(activitiy.id.length ===0){
            let newActivity = {
                ...activitiy,
                id: uuid()
            }
            createActivity(newActivity);
        } else{
            editActivity(activitiy);
        }
    };

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({...activitiy, [name]: value});
        
    };

    return (

    <Segment clearing>
        <Form onSubmit={handleSubmit}>
            <Form.Input 
                onChange={handleInputChange} 
                name='title' 
                placeholder='Title' 
                value={activitiy.title}
            />
            <Form.TextArea 
                onChange={handleInputChange} 
                name='description' 
                rows={2} 
                placeholder='Description' 
                value={activitiy.description}
            />
            <Form.Input 
                onChange={handleInputChange} 
                name='category' 
                placeholder='Category' 
                value={activitiy.category}
            />
            <Form.Input 
                onChange={handleInputChange} 
                name='date' 
                type='datetime-local' 
                placeholder='Date' 
                value={activitiy.date}
            />
            <Form.Input 
                onChange={handleInputChange} 
                name='city' 
                placeholder='City' 
                value={activitiy.city}
            />
            <Form.Input 
                onChange={handleInputChange} 
                name='venue' 
                placeholder='Venue' 
                value={activitiy.venue}
            />
            <Button   
                loading={submitting}  
                floated='right' 
                positive 
                type='submit' 
                content='Submit'
            />
            <Button 
                onClick={cancelFormOpen} 
                floated='right' 
                type='button' 
                content='Cancel'
            />
        </Form>
    </Segment>

  )
}

export default observer(ActivityForm);
