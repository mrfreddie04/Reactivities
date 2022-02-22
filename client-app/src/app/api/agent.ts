import { Profile, Photo } from './../models/profile';
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { history } from "../../index";
import { store } from "../../app/stores/store";
import { PaginatedResult } from "../models/pagination";
import { UserActivity } from "../models/userActivity";

type ValidationErrors = {[key:string]: string};

const sleep = (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use( config => {
  const token = store.commonStore.token;
  if(token && config.headers) {
    //console.log("Add Token", token);
    config.headers.Authorization = `Bearer ${token}`;    
  }
  config.withCredentials = true;
  return config;
});

axios.interceptors.response.use( 
  async (response) => {
    if(process.env.NODE_ENV === "development")
      await sleep(1000);
  
    const pagination = response.headers["pagination"];
    if(pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response as AxiosResponse<PaginatedResult<any>>;
    }
  
    return response;
  }, 
  (error: AxiosError) => {
    const { data, status, config, headers } = error.response!;

    switch (status) {
      case 400: 
        if(config.method === "get" && data.errors && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        } else if(data.errors) {
          const modalStateErrors = Object.values(data.errors as ValidationErrors).flat();
          throw modalStateErrors;
        } else {
          toast.error(data);
        }
        break;
      case 401: 
        if(headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"')) {
          store.userStore.logout();
          toast.error("Session expired - please login again");
        } 
        // else {
        //   toast.error("unauthorized");
        // }
        break;
      case 404: 
        history.push("/not-found");
        break;  
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T,D>(url: string, body: D) => axios.post<T,AxiosResponse<T,D>,D>(url, body).then(responseBody),
  put: <T,D>(url: string, body: D) => axios.put<T,AxiosResponse<T,D>,D>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>("/activities",{params}).then(responseBody),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void,ActivityFormValues>("/activities", activity),
  update: (activity: ActivityFormValues) => requests.put<void,ActivityFormValues>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void,{}>(`/activities/${id}/attend`,{})
};

const Account = {
  current: () => requests.get<User>(`/account`),
  login: (user: UserFormValues) => requests.post<User,UserFormValues>("/account/login", user),
  register: (user: UserFormValues) => requests.post<string,UserFormValues>("/account/register", user),
  fbLogin: (accessToken: string) => requests.post<User,{}>(`/account/fblogin?accessToken=${accessToken}`, {}),
  refreshToken: () => requests.post<User,{}>("/account/refresh-token", {}),
  verifyEmail: (token: string, email: string) => 
    requests.post<string,{}>(`/account/verify-email?email=${email}&token=${token}`,{}),
  ResendEmailConfirm: (email: string) => 
    requests.get<string>(`/account/resend-email-confirmation-link?email=${email}`)
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  update: (profile: Partial<Profile>) => requests.put<void,Partial<Profile>>("/profiles", profile),
  updateFollowing: (username: string) => requests.post<void,{}>(`/follow/${username}`,{}),
  listEvents: (username: string, predicate: string) => 
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
  listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  setMainPhoto: (id: string) => requests.post<void,{}>(`/photos/${id}/setMain`,{}),
  deletePhoto: (id: string) => requests.del<void>(`/photos/${id}`),
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo,AxiosResponse<Photo,FormData>,FormData>("/photos", formData, {
      headers: {"Content-Type": "multipart/form-data"}
    }).then( ({data}) => data);
  }
};

const agent = { Activities, Account, Profiles };

export default agent;