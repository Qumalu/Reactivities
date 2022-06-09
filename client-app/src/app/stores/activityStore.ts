import { observable, action, makeObservable, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivitiy } from '../models/activitiy';

configure({enforceActions: 'always'})

export class ActivityStore {
    // Observable map for activities ( more options then normal array, can be used as Array.from(this.OurMap))
    @observable activityRegistry = new Map();
    // Observable prop for storing our Activity data
    @observable activities: IActivitiy[] = [];
    // Observable prop for loading state
    @observable loadingInitial = false;
    // Observable prop for selected Activity
    @observable selectedActivity: IActivitiy | undefined;
    // Observable prop for form display state
    @observable editMode = false;
    // Observable prop for loading state
    @observable submitting = false;
    // Oservable prop for target loading
    @observable target = '';

    // Method for returning activities list sorted by date
    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // Const for setting class to be observable
    constructor() {        
        makeObservable(this);
    }

    // Action for getting Activity data from API
    @action loadActivities = async () => {
        // Turn on loading 
        this.loadingInitial = true;
        try{
            // Send a get request to API for Activities list
            const activities = await agent.Activities.list();   
            runInAction(() => {
                // Formating Date in our list of Activities       
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    // Passing formated data to observerble map
                    this.activityRegistry.set(activity.id, activity);
                });               
                // Set loading off
                this.loadingInitial = false;
            })
            
        } catch (error) {         
            // Set loading off
            runInAction(() => {                
                this.loadingInitial = false;  
            })
            // log error
            console.log(error);  
        }
    }    

    // Action for getting selected Activty based on an id
    @action selectActivity = (id: string) => {
        // Selecting activity from observable map of activities
        this.selectedActivity = this.activityRegistry.get(id);
        // Turning off form
        this.editMode = false;
    }

    // Action for Creating activity
    @action createActivity = async (activity: IActivitiy) => {
        // Turn on loading state
        this.submitting = true;
        try{
            // Call API post via axios agent to create activity
            await agent.Activities.create(activity);
            runInAction(() => {
                // Add new activity to observable map of activities
                this.activityRegistry.set(activity.id, activity);
                // Turn off form and loading
                this.editMode = false;
                this.submitting = false;
            })                     
        } catch (error) {
            runInAction(() => {
                // turn of loading
                this.submitting = false;
            })           
            // log errors
            console.log(error);
        }
    }

    // Action form Editing activitiy
    @action editActivity = async (activity: IActivitiy) => {
        // Turn on loading state
        this.submitting = true;
        try{
            // Call API put via axios agent to update activity
            await agent.Activities.update(activity);

            runInAction(() => {
                // Set updated activity to observable map of activities
                this.activityRegistry.set(activity.id, activity);
                // Set selected activity
                this.selectedActivity = activity;
                // Turn off form and loading
                this.editMode = false;
                this.submitting = false;
            })

          
        } catch (error) {
            runInAction(() => {
                // turn of loading
                this.submitting = false;
            })           
            // log errors
            console.log(error);
        }
    }

    // Action for deleting an activity
    @action deleteActivity = async(event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        // Turn on loading state
        this.submitting = true;
        // Setting target for loading
        this.target = event.currentTarget.name;
        try{
            // Call API delete via axios 
            await agent.Activities.delete(id);
            runInAction(() => {
                // Remove activity from observable map of activities
                this.activityRegistry.delete(id);
                // Reset target and loading
                this.submitting = false;
                this.target = '';
            })
          
        } catch (error) {
            runInAction(() => {
                // Reset target and loading
                this.submitting = false;
                this.target = '';   
            })         
            console.log(error);
        }
    }

    // Action for turning on edit form
    @action openEditForm = (id: string) => {
        // Selecting activity for edit form
        this.selectedActivity = this.activityRegistry.get(id);
        // Turning on edit form
        this.editMode = true;
    }   

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    // Action for turning on create form
    @action openCreateForm = () => {
        this.editMode = true;
        // Making sure there are no selected activities cause then we need edit form
        this.selectedActivity = undefined;
    }
}

export default createContext(new ActivityStore())