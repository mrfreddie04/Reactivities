import { Activity } from '../models/activity';
import { makeAutoObservable, runInAction } from "mobx";
import {v4 as uuid} from "uuid";
import agent from "../api/agent";

type ActivityGroups = {[key:string]: Activity[]};

export default class ActivityStore {
  //public activities: Activity[] = [];
  public activityRegistry: Map<string,Activity> = new Map<string,Activity>();
  public selectedActivity: Activity | undefined = undefined;  
  public editMode: boolean = false;
  public loading: boolean = false;
  public loadingInitial: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  public get activitiesByDate() : Activity[] {
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
      Date.parse(a.date) - Date.parse(b.date));
  }

  public get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce<ActivityGroups>( (activities, activity) => {
        const dt = activity.date;
        activities.hasOwnProperty(dt) 
          ? activities[dt].push(activity)
          : activities[dt] = [activity];
        return activities;  
      },{}) 
    ).sort((a,b)=> 
      Date.parse(a[0]) - Date.parse(b[0])
    );
  }

  public loadActivities = async () => {
    if(!this.loadingInitial)
      this.loadingInitial= true;
    //this.setLoadingInitial(true);

    try {
      const response = await agent.Activities.list();

      /*
      this.activityRegistry = new Map(response.map( activity => { 
        const [dt] = activity.date.split("T");
        activity.date = dt;
        return [activity.id,activity];
        //return {...activity, date: dt};
      }));
      */

      /*this.activities = response.map( activity => { 
        const [dt] = activity.date.split("T");
        activity.date = dt;        
        return {...activity, date: dt};
      });*/
      runInAction(()=>{
        response.forEach( activity => this.setActivity(activity));
        
        if(this.activityRegistry.size) {
          const [firstActivity] = this.activitiesByDate;
          this.selectedActivity = firstActivity;   
        }        
      });

    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoadingInitial(false);
      });  
    }    
  }; 

  public loadActivity = async (id: string) => {
    const activity = this.getActivity(id);
    if(activity) {
      this.selectedActivity = activity;
      return activity;
    }
  
    try {
      this.setLoadingInitial(true);
      const activity = await agent.Activities.details(id);
      runInAction(()=>{
        this.setActivity(activity);
        this.selectedActivity = activity;
      });  
      return activity;
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoadingInitial(false);
      });  
    }       
  }  
  
  public setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  public setLoading = (state: boolean) => {
    this.loading = state;
  }

  public createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    
    try {
      await agent.Activities.create(activity);
      runInAction(()=>{
        //this.activities.push(activity);
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity = activity;
      });  
      return activity;
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }    
  }

  public updateActivity = async (activity: Activity) => {
    this.setLoading(true);
    
    try {
      await agent.Activities.update(activity);
      runInAction(()=>{
        this.activityRegistry.set(activity.id,activity);
        //this.activities = this.activities.map( el => el.id === activity.id? activity : el)
        this.selectedActivity = activity;
      });  
      return activity;
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }    
  }  

  public deleteActivity = async (id: string) => {
    this.setLoading(true);

    try {
      await agent.Activities.delete(id);
      runInAction(()=>{
        //this.activities = this.activities.filter( activity => activity.id !== id);
        this.activityRegistry.delete(id);
        if(this.selectedActivity && this.selectedActivity.id === id)
          this.selectedActivity = undefined;
      });
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }   
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }  

  private setActivity = (activity: Activity) => {
    const [dt] = activity.date.split("T");
    activity.date = dt;
    this.activityRegistry.set(activity.id, activity);
  }  

}


