import {
  observable,
  action,
  makeObservable,
  computed,
  configure,
  runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivitiy } from "../models/activitiy";

configure({ enforceActions: "always" });

export class ActivityStore {
  // Observable map for activities ( more options then normal array, can be used as Array.from(this.OurMap))
  @observable activityRegistry = new Map();
  // Observable prop for loading state
  @observable loadingInitial = false;
  // Observable prop for selected Activity
  @observable activity: IActivitiy | null = null;
  // Observable prop for loading state
  @observable submitting = false;
  // Oservable prop for target loading
  @observable target = "";

  // Method for returning activities list sorted by date
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivitiy[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivitiy[] })
    );
  }

  // Const for setting class to be observable
  constructor() {
    makeObservable(this);
  }

  // Action for getting Activity data from API
  @action loadActivities = async () => {
    // Turn on loading
    this.loadingInitial = true;
    try {
      // Send a get request to API for Activities list
      const activities = await agent.Activities.list();
      runInAction(() => {
        // Formating Date in our list of Activities
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          // Passing formated data to observerble map
          this.activityRegistry.set(activity.id, activity);
        });
        // Set loading off
        this.loadingInitial = false;
      });
      // Only use to see the output of the function
      console.log(this.groupActivitiesByDate(activities));
    } catch (error) {
      // Set loading off
      runInAction(() => {
        this.loadingInitial = false;
      });
      // log error
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        // log error
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  // Action for Creating activity
  @action createActivity = async (activity: IActivitiy) => {
    // Turn on loading state
    this.submitting = true;
    try {
      // Call API post via axios agent to create activity
      await agent.Activities.create(activity);
      runInAction(() => {
        // Add new activity to observable map of activities
        this.activityRegistry.set(activity.id, activity);
        // Turn off loading
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        // turn of loading
        this.submitting = false;
      });
      // log errors
      console.log(error);
    }
  };

  // Action form Editing activitiy
  @action editActivity = async (activity: IActivitiy) => {
    // Turn on loading state
    this.submitting = true;
    try {
      // Call API put via axios agent to update activity
      await agent.Activities.update(activity);

      runInAction(() => {
        // Set updated activity to observable map of activities
        this.activityRegistry.set(activity.id, activity);
        // Set selected activity
        this.activity = activity;
        // Turn off loading
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        // turn of loading
        this.submitting = false;
      });
      // log errors
      console.log(error);
    }
  };

  // Action for deleting an activity
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    // Turn on loading state
    this.submitting = true;
    // Setting target for loading
    this.target = event.currentTarget.name;
    try {
      // Call API delete via axios
      await agent.Activities.delete(id);
      runInAction(() => {
        // Remove activity from observable map of activities
        this.activityRegistry.delete(id);
        // Reset target and loading
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        // Reset target and loading
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  @action cancelSelectedActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
