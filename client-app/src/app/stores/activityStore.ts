import { Activity, ActivityFormValues } from '../models/activity';
import { makeAutoObservable, reaction, runInAction } from "mobx";
import {v4 as uuid} from "uuid";
import agent from "../api/agent";
import { format } from 'date-fns';
import { store } from "./store";
import { Photo, Profile } from '../models/profile';
import { Pagination, PagingParams } from "../models/pagination";

type ActivityGroups = {[key:string]: Activity[]};

export default class ActivityStore {
  //public activities: Activity[] = [];
  public activityRegistry: Map<string,Activity> = new Map<string,Activity>();
  public selectedActivity: Activity | undefined = undefined;  
  public pagination: Pagination | null = null;
  public pagingParams: PagingParams = new PagingParams();
  public editMode: boolean = false;
  public loading: boolean = false;
  public loadingInitial: boolean = false;
  public predicate = new Map().set("all",true);

  constructor() {
    makeAutoObservable(this);

    reaction( 
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams(); //reset to start from page one for new filter
        this.activityRegistry.clear();
        this.loadActivities(); 
      }
    );       
  }

  public get activitiesByDate() : Activity[] {
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
      a.date!.getTime() - b.date!.getTime());
  }

  public get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce<ActivityGroups>( (activities, activity) => {
        const dt = format(activity.date!,"dd MMM yyyy");//!.toISOString().split("T");
        activities.hasOwnProperty(dt) 
          ? activities[dt].push(activity)
          : activities[dt] = [activity];
        return activities;  
      },{}) 
    ).sort((a,b)=> 
      Date.parse(a[0]) - Date.parse(b[0])
    );
  }

  public get axiosParams() {
    const params = new URLSearchParams();
      params.append("pageNumber",String(this.pagingParams.pageNumber));
      params.append("pageSize",String(this.pagingParams.pageSize));
      this.predicate.forEach((value,key)=>{
        if(key === "startDate") {
          params.append(key,(value as Date).toISOString());  
        } else {
          params.append(key,value);
        }
      });
    return params;  
  }

  public loadActivities = async () => {
    if(!this.loadingInitial)
      this.loadingInitial= true;

    try {
      const response = await agent.Activities.list(this.axiosParams);
      //console.log("RES",response);
      runInAction(()=>{
        response.data.forEach( activity => this.setActivity(activity));      
        this.setPagination(response.pagination);
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

  public clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }
  
  private setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  public setLoading = (state: boolean) => {
    this.loading = state;
  }

  public createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    
    try {
      activity.id = uuid();
      await agent.Activities.create(activity);
      
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      
      runInAction(()=>{
        this.setActivity(newActivity);
        this.selectedActivity = this.getActivity(newActivity.id);
      });  
      return activity.id;
    } catch(err) {
      console.log(err);
    }  
  }

  public updateActivity = async (activity: ActivityFormValues) => {

    try {
      await agent.Activities.update(activity);
      const oldActivity = this.getActivity(activity.id);
      if(!oldActivity) return;

      const updatedActivity: Activity = {...oldActivity, ...activity};

      runInAction(()=>{
        this.setActivity(updatedActivity);
        this.selectedActivity = this.getActivity(updatedActivity.id);
      });  
    } catch(err) {
      console.log(err);
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

  public cancelActivityToggle = async (id: string) => {
    if(!this.selectedActivity) return;
    this.setLoading(true);

    try {
      await agent.Activities.attend(this.selectedActivity.id);
      runInAction(()=>{
        if(!this.selectedActivity) return;
        this.selectedActivity.isCancelled = !this.selectedActivity.isCancelled;
        this.activityRegistry.set(this.selectedActivity.id, this.selectedActivity);
      });
    } catch(err) {
      console.log(err);
    } finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }   
  }

  public updateAttendance = async () => {
    if(!this.selectedActivity) return;

    const user = store.userStore.user;
    this.setLoading(true);
    try {
      await agent.Activities.attend(this.selectedActivity.id);
      runInAction(()=>{
        if(!this.selectedActivity) return;
        if(this.selectedActivity.isGoing) {          
          this.selectedActivity.attendees = 
            this.selectedActivity.attendees?.filter(attendee => attendee.username !== user?.username);
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity.attendees = [...this.selectedActivity.attendees || [], attendee ];
          this.selectedActivity.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity.id, this.selectedActivity);
      });        
    } catch(error) {
      console.log(error)
    }
    finally {
      runInAction(()=>{
        this.setLoading(false);      
      });  
    }
  }

  public updateAtendeeFollowing = (username: string) => {
    this.activityRegistry.forEach( (activity)=>{
      const attendee = activity.attendees.find( a => a.username === username);
      if(attendee) {
        attendee.following ? attendee.followersCount-- : attendee.followersCount++;
        attendee.following = !attendee.following;
      }
    });  
  }

  public setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  }

  public setPredicate = (predicate: string, value: boolean | Date) => {
    //If not startDate - then delete all non-date keys,as they are mutually exclusive
    if(predicate !== "startDate") {
      this.predicate.forEach((value,key) => {
        if(key !== "startDate" ) this.predicate.delete(key);
      });
    }
    //delete and recreate - for MobX Reactions
    if(this.predicate.has(predicate)) this.predicate.delete(predicate);
    this.predicate.set(predicate, value);  
  }

  // public updatePhotos = (username: string, photo: Photo) => {
  //   //this.activityRegistry.values())
  //   this.activityRegistry.forEach( (activity,key)=>{
  //     if(activity.hostUsername === username && activity.host) {
  //       activity.host.image = photo.url;
  //       if(activity.host.photos)
  //         this.setMainPhoto(activity.host.photos,photo);
  //     }  

  //     activity.attendees
  //       .filter( a => a.username === username && a.photos)  
  //       .forEach( a => this.setMainPhoto(a.photos!, photo));
  //   });
  // }

  private setMainPhoto = (photos: Photo[], photo: Photo) => {
    photos.forEach( p => p.isMain = (p.id === photo.id));
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }  

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if(user) {
      activity.isGoing = activity.attendees?.some(attendee => attendee.username === user.username );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(attendee => attendee.username === activity.hostUsername );
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);    
  }  

  private setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  }
}


