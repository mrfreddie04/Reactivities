import { Profile } from "./profile";

export interface ActivityFormValues {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
}  

export interface Activity extends ActivityFormValues {
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees: Profile[];
}

export class ActivityFormValues {
  id: string = "";
  title: string = "";
  date: Date | null = null;
  description: string = "";
  category: string = "";
  city: string = "";
  venue: string = "";  

  constructor( activity?: ActivityFormValues) {
    if(activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.date = activity.date;
      this.description = activity.description;
      this.category = activity.category;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }
}

export class Activity extends ActivityFormValues implements Activity {
  constructor(init?: ActivityFormValues) {
    super(init);
    this.hostUsername = "";
    this.isCancelled = false;
    this.isGoing = false;
    this.isHost = false;
    this.attendees = [];
  }
}
