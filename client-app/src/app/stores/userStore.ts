import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../../index";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
  public user: User | null = null;
  public fbAccessToken: string | null = null;
  public fbLoading: boolean = false;

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

  public facebookLogin = async () => {
    this.setFbLoading(true);
    
    try {
      if(!this.fbAccessToken) {
        await this.fbFbLogin();
      }
      if(this.fbAccessToken) {
        await this.apiFbLogin(this.fbAccessToken);
      }    
    } catch(err) {
      console.log(err);
    } finally {
      this.setFbLoading(false);
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
    if(!token) {
      await this.getFacebookLoginStatus();
      return null;      
    }

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

  private apiFbLogin = (accessToken: string) => {
    return agent.Account.fbLogin(accessToken)
      .then((user) => {
        console.log("Connected to API", user.displayName);
        store.commonStore.setToken(user.token);
        this.setUser(user);
        history.push("/activities");
      });
  }  

  private fbFbLogin = () => {
    return new Promise<boolean>((resolve,reject) => {
      window.FB.login( 
        (response)=>{
          if(response.status === "connected") {
            this.setFbAccessToken(response.authResponse.accessToken);
            console.log("Connected to FB");
            return resolve(true);
          }
          console.log("FB login failed");
          return reject("FB login error");
        },
        { scope: "public_profile,email" }
      );      
    })
  }  

  private getFacebookLoginStatus = () => {
    return new Promise<boolean>((resolve, reject) => {
      window.FB.getLoginStatus( (response) => {
        if(response.status === "connected") {
          console.log("Connected to FB");
          this.setFbAccessToken(response.authResponse.accessToken);
          return resolve(true);
        }
        console.log("NOT Connected to FB");
        return resolve(false);
      })    
    });
  }

  private setFbAccessToken = (accessToken: string) => {
    this.fbAccessToken = accessToken;
  }

  private setFbLoading = (status: boolean) => {
    this.fbLoading = status;
  }  

  private setUser = (user: User) => {
    this.user = user;
  }
} 