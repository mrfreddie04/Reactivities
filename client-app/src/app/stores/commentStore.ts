import { makeAutoObservable, runInAction } from "mobx";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { store } from "./store";

const baseUrl = process.env.REACT_APP_CHAT_URL;

export default class CommentStore {
  public comments: ChatComment[] = [];
  public hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }  

  public createHubConnection = (activityId: string) => {
    if(store.activityStore.selectedActivity ) {
      //build connection
      //note! previously used for activityId: store.activityStore.selectedActivity.id
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${baseUrl}?activityId=${activityId}`, {
          accessTokenFactory: () => store.commonStore.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
  
      //start connection
      this.hubConnection.start()
        //.then( () => console.log("Hub Connection Started"))
        .catch(err => {
          console.log("Error establishing the connection: ", err);
        });

      this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
        runInAction(() => {
          this.comments = comments.map( comment => {
            const suffix = comment.createdAt.toString().endsWith("Z") ? "" : "Z";
            comment.createdAt = new Date(comment.createdAt + suffix);
            return comment;
          });
        });
      });

      this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
        runInAction(() => {
          const suffix = comment.createdAt.toString().endsWith("Z") ? "" : "Z";
          comment.createdAt = new Date(comment.createdAt + suffix);
          this.comments.unshift(comment);
        });
      });
    }
  }

  public stopHubConnection = () => {
    if(!this.hubConnection) return;
    this.hubConnection.stop()
      //.then( () => console.log("Hub Connection Stopped"))
      .catch(err => {
        console.log("Error stopping connection: ", err);
      });
  }

  public clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  }

  public addComment = async (values: any) => {
    if(!store.activityStore.selectedActivity || !this.hubConnection) return;
    values.activityId = store.activityStore.selectedActivity.id;    
    try {
      await this.hubConnection.invoke("SendComment", values);
    } catch(err) {
      console.log(err);
    }
  }
}