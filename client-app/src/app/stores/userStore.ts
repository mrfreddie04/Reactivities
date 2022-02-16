import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../../index";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
  public user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get isLoggedIn(): boolean  {
    return !!this.user;
  }

  public login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(()=>this.user = user);  
      history.push("/activities");
      store.modalStore.closeModal();
    } catch(err) {
      this.user = null;
      throw err;
    }     
  }

  public register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      runInAction(() => {
        store.commonStore.setToken(user.token);
        this.user = user;  
        history.push("/activities");
        store.modalStore.closeModal();
      });  
    } catch(err) {
      runInAction(() =>
        this.user = null
      );  
      throw err;
    }     
  }  

  public logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  }

  public getUser = async () => {
    var token = store.commonStore.token;
    if(!token) return null;      
    
    try {
      var user = await agent.Account.current();
      runInAction(()=>{
        store.commonStore.setToken(user.token);
        this.user = user;
      });  
      history.push("/activities");      
    } catch(err) {
      console.log(err);
    }
  } 

  public setImage = (image: string) => {
    if(this.user)
      this.user.image = image;
  }

  public setDisplayName = (displayName: string) => {
    if(this.user)
      this.user.displayName = displayName;
  }
} 