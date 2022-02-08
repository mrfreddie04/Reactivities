import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
import { history } from "../../index";
import { store } from "../../app/stores/store";

type ValidationErrors = {[key:string]: string};

const sleep = (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use( async response => {
  await sleep(1000);
  return response;
  // return sleep(1000)
  //   .then(()=>response)
  //   .catch((err)=>{
  //     console.log(err);
  //     return Promise.reject(err);
  //   }
  // );
}, (error: AxiosError) => {
  const { data, status, config } = error.response!;

  switch (status) {
    case 400: 
      // if(typeof data === "string") {
      //   toast.error(data);
      // }
      // else 
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
      toast.error("unauthorized");
      break;
    case 404: 
      history.push("/not-found");
      break;  
    case 500:
      store.commonStore.setServerError(data);
      history.push("server-error");
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
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void,Activity>("/activities", activity),
  update: (activity: Activity) => requests.put<void,Activity>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`)
};

const agent = { Activities };

export default agent;