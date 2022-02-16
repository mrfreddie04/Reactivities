import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import { Photo, Profile } from "../models/profile";

export default class ProfileStore {
  public profile: Profile | null = null;
  public loadingProfile: boolean = false;
  public uploading: boolean = false;
  public loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public get isCurrentUser() {
    const user = store.userStore.user;
    if(!this.profile || !user) return false;
    return this.profile.username === user.username;
  }

  public loadProfile = async (username: string) => {
    this.setLoadingProfile(true);

    try {
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

  private setProfile = (profile: Profile) => {
    this.profile = profile;
  }

  private setUpdateProfile = (profile: Partial<Profile>) => {
    if(!this.profile) return;

    this.profile = {...this.profile, ...profile};
  }  
}  