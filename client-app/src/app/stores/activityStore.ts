import { Activity } from '../models/activity';
import { makeAutoObservable, runInAction } from "mobx";
import {v4 as uuid} from "uuid";
import agent from "../api/agent";

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

  public loadActivities = async () => {
    //this.loadingInitial= true;
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
        response.forEach( activity => { 
          const [dt] = activity.date.split("T");
          activity.date = dt;
          this.activityRegistry.set(activity.id, activity);
        })
        
        if(this.activityRegistry.size) {
          const [firstKey] = Array.from(this.activityRegistry.keys());
          this.setSelectedActivity(firstKey);   
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
  
  public setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  public setSelectedActivity = (id: string) => {
    //this.selectedActivity = this.activities.find( activity => activity.id === id);
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  }

  public cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  public setOpenForm = (id?: string) => {
    id ? this.setSelectedActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  }

  public setCloseForm = () => {
    this.editMode = false;
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
        this.setSelectedActivity(activity.id);
      });  
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
        this.setSelectedActivity(activity.id);
      });  
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
          this.cancelSelectedActivity();
      });
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }   
  }

}


