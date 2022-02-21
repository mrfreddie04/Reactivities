import { makeAutoObservable, reaction  } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { Photo, Profile } from "../models/profile";
import { UserActivity } from "../models/userActivity";

export default class ProfileStore {
  public profile: Profile | null = null;
  public loadingProfile: boolean = false;
  public uploading: boolean = false;
  public loading: boolean = false;
  public loadingFollowings: boolean = false;
  public followings: Profile[] = [];
  public events: UserActivity[] = [];
  public loadingEvents: boolean = false;
  public activeTab: number = 0;

  constructor() {
    makeAutoObservable(this);

    reaction( 
      () => this.activeTab,
      (activeTab) => {
        // if(activeTab===2) {
        //   this.loadEvents();
        // }
        this.followings = [];
        if(activeTab===3 || activeTab===4) {
          const predicate = activeTab===3 ? "followers" : "following";
          this.loadFollowings(predicate);
        }       
      }
    );    
  }

  public setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;
  }

  public isCurrentUser = (username: string | undefined) => {
    const user = store.userStore.user;
    if(!user || !username) return false;
    return username === user.username;
  }

  // public isCurrentUser() {
  //   const user = store.userStore.user;
  //   if(!this.profile || !user) return false;
  //   return this.profile.username === user.username;
  // }

  public loadProfile = async (username: string) => {
    this.setLoadingProfile(true);

    try {
      //console.log(this.profile);
      const profile = await agent.Profiles.get(username);
      this.setProfile(profile);    
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoadingProfile(false);    
    } 
  }

  public updateProfile = async (profile: Partial<Profile>) => {
    this.setLoading(true);

    try {
      await agent.Profiles.update(profile);
      if(profile.displayName)
        store.userStore.setDisplayName(profile.displayName);
      this.setUpdateProfile(profile);    
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoading(false);    
    } 
  }  

  public uploadPhoto = async (file: Blob) => {
    this.setUploading(true);

    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      this.setPhotoAdd(photo);    
    } catch(err) {
      console.log(err);
    } finally {
      this.setUploading(false);    
    }     
  }

  public deletePhoto = async (photo: Photo) => {
    this.setLoading(true);

    try {
      await agent.Profiles.deletePhoto(photo.id);
      this.setPhotoDelete(photo.id);
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoading(false);   
    }     
  }  

  public setMainPhoto = async (photo: Photo) => {
    this.setLoading(true);

    try {
      await agent.Profiles.setMainPhoto(photo.id);
      this.setPhotoMain(photo);
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoading(false);    
    }     
  }    

  public loadFollowings = async (predicate: string ) => {
    if(!this.profile) return;
    this.setLoadingFollowings(true);  

    try {
      const followings = await agent.Profiles.listFollowings(this.profile.username, predicate); 
      this.setFollowings(followings);
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoadingFollowings(false);    
    }    
  }

  public loadEvents = async (predicate?: string) => {
    if(!this.profile) return;
    this.setLoadingEvents(true);  

    try {
      const events = await agent.Profiles.listEvents(this.profile.username, predicate || ""); 
      this.setEvents(events);
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoadingEvents(false);    
    }    
  }  

  public updateFollowing = async (username: string, following: boolean) => {    
    this.setLoading(true);  

    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAtendeeFollowing(username);    
      this.setFollowing(username, following);
    } catch(err) {
      console.log(err);
    } finally {
      this.setLoading(false);    
    }     
  }

  private setFollowing = (username: string, following: boolean) => {
    //when clicking follow/unfollow on user's profile (different than the currently logged user)
    if(this.profile && this.profile.username === username && !this.isCurrentUser(username)) {
      following ? this.profile.followersCount++ : this.profile.followersCount--;
      this.profile.following = following;      
    }
    //when currently logged user navigates thru his profile 
    //via followers/following tab, and clicks on the following button on the card of following.followed user
    //we need to update stats in the header
    if(this.profile && this.profile.username !== username && this.isCurrentUser(this.profile.username)) {
      following ? this.profile.followingCount++ : this.profile.followingCount--;     
    }    
    //update the followings observable - it is used to display cards in the followers/following tabs of ProfilePage
    //this way upon clicking on the follow/unfollow button we willse the number of followers updated (in the card)
    //and the button label (on the card) as it gets profile object passed down as s property
    //ProfileFollowings (the parent component of the card) observes followings observable, so when it is updated
    //ProfileFollowings and its children are rerendered.
    this.followings.forEach( profile => {    
      if(profile.username === username) {
        //console.log(this.profile?.username, profile.username, profile.following, profile.followersCount);
        profile.following ? profile.followersCount-- : profile.followersCount++;
        profile.following = !profile.following;
      }
    });
  }

  private setPhotoMain = (photo: Photo) => {
    if(this.profile && this.profile.photos) {
      const oldMainPhoto = this.profile.photos.find( p => p.isMain)
      if(oldMainPhoto) oldMainPhoto.isMain = false;

      const newMainPhoto = this.profile.photos.find( p => p.id === photo.id)
      if(newMainPhoto) {
        newMainPhoto.isMain = true;
        this.profile.image = photo.url;
        if(store.userStore.user)
          store.userStore.setImage(photo.url);
      }
    }
  }  

  private setPhotoDelete = (id: string) => {
    if(this.profile && this.profile.photos) {
      this.profile.photos = this.profile.photos.filter( p => p.id !== id);
    }
  }  


  private setPhotoAdd = (photo: Photo) => {
    if(this.profile) {
      this.profile.photos 
        ? this.profile.photos.push(photo) 
        : this.profile.photos = [photo];
      
      if(photo.isMain) {
        this.profile.image = photo.url;
        if(store.userStore.user)
          store.userStore.setImage(photo.url);
      } 
    }
  }

  private setLoadingProfile = (state: boolean) => {
    this.loadingProfile = state;
  }

  private setUploading = (state: boolean) => {
    this.uploading = state;
  }  

  private setLoading = (state: boolean) => {
    this.loading = state;
  }  

  private setLoadingFollowings = (state: boolean) => {
    this.loadingFollowings = state;
  } 

  private setLoadingEvents = (state: boolean) => {
    this.loadingEvents = state;
  }   

  private setProfile = (profile: Profile) => {
    this.profile = profile;
  }

  private setFollowings = (followings: Profile[]) => {
    this.followings = followings;
  }  

  private setEvents = (events: UserActivity[]) => {
    this.events = events.map( event => {
      event.date = new Date(event.date);
      return event;
    });
  }    

  private setUpdateProfile = (profile: Partial<Profile>) => {
    if(!this.profile) return;

    this.profile = {...this.profile, ...profile};
  }  
}  