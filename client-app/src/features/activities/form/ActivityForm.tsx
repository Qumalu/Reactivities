import React, {FormEvent, useState} from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivitiy } from '../../../app/models/activitiy';
import {v4 as uuid} from 'uuid';

interface IProps{
    setEditMode: (editMode: boolean) => void;
    activity: IActivitiy;
    createActivity: (activity: IActivitiy) => void;
    editActivity: (activity: IActivitiy) => void;
   
}

const ActivityForm : React.FC<IProps> = ({
        setEditMode, 
        activity: initialFormState,
        createActivity,
        editActivity
    }) => {
    
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
                floated='right' 
                positive 
                type='submit' 
                content='Submit'
            />
            <Button 
                onClick={() => setEditMode(false)} 
                floated='right' 
                type='button' 
                content='Cancel'
            />
        </Form>
    </Segment>

  )
}

export default ActivityForm
