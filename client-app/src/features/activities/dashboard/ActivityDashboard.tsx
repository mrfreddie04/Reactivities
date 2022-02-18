import React, { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import InfiniteScroll from "react-infinite-scroller";
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../app/stores/store";
import { PagingParams } from '../../../app/models/pagination';
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
//import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

function AcivityDashboard() {

  const { activityStore: { loadingInitial, activityRegistry, loadActivities, setPagingParams, pagination } } = useStore();

  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    if(activityRegistry.size <= 1) {
      loadActivities();  
    }
  },[loadActivities,activityRegistry.size]);

  // if(loadingInitial && !loadingNext)
  //   return (
  //     <LoadingComponent content="Loading activities..."></LoadingComponent>
  //   );  

  const handleLoadNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage+1));
    loadActivities().then(() => setLoadingNext(false));
  }

  const hasMore = () => {
    return (!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages) || false;
  }

  return (    
    <Grid columns={1}>
      <Grid.Column width="10">
        {loadingInitial && !loadingNext 
          ? (
              <>
                <ActivityListItemPlaceholder/>
                <ActivityListItemPlaceholder/>
              </>
            )
          : (
              <InfiniteScroll
                pageStart={0}
                loadMore={handleLoadNext}
                hasMore={hasMore()}
                initialLoad={false}    
              >
                <ActivityList />
              </InfiniteScroll>            
            )
        }
      </Grid.Column>      
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width="10">
        <Loader active={loadingNext}/>
      </Grid.Column>
    </Grid>
  );
}

export default observer(AcivityDashboard);