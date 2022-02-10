import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  public error: ServerError | null = null;
  public token: string | null = window.localStorage.getItem("jwt");
  public appLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);

    reaction( 
      () => this.token,
      (token) => {
        if(token)
          window.localStorage.setItem("jwt", token);
        else  
          window.localStorage.removeItem("jwt");
      }
    );
  }

  public setServerError = (error: ServerError) => {
    this.error = error;
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public setAppLoaded = () => {
    this.appLoaded = true;
  }
} 
