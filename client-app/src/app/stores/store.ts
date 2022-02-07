import { createContext, useContext } from 'react';
import ActivityStore from "./activityStore";

interface Store {
  activityStore: ActivityStore;
};

export const store: Store = {
  activityStore: new ActivityStore()
}

//add MobxStores to the context - to be used as the provider
export const StoreContext = createContext(store);

// create a methos to retrive data from the context
export function useStore() {
  return useContext(StoreContext);
}