import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  public error: ServerError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setServerError = (error: ServerError) => {
    this.error = error;
  }
} 
