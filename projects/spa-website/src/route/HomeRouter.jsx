import React from "react";
import { routePath } from "./routePath";
import { Redirect, Route, Switch } from "react-router-dom";

import { Profile } from "page/wcms/profile";
import { DashBoard } from "page/wcms/dashboard";
import { AnnouncementEditor } from "page/wcms/announcementManage";
import { HandleOrder } from "page/wcms/handleOrder";
import { NotFound } from "COMPONENTS/notFound/PageNotFound";

function HomeRouter() {
  return (
    <Switch>
      <Route exact={true} path={routePath.HOME}>
        <Redirect to={routePath.DASHBOARD} />
      </Route>
      <Route path={routePath.SELF_INFO}>
        <Profile />
      </Route>

      <Route path={routePath.DASHBOARD}>
        <DashBoard />
      </Route>
      <Route path={routePath.ANNOUNCE}>
        <AnnouncementEditor />
      </Route>
      <Route path={routePath.HANDLE_ORDER}>
        <HandleOrder />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
  /**
   *
   <Route path={routePath.MEMBER_LIST}>
   <MemberList />
   </Route>

   <Route path={routePath.TAG_MANAGE}>
   <TagManage />
   </Route>

   <Route path={routePath.IMG_HOST}>
   <NotFound />
   </Route>

   <Route path={routePath.HANDLE_ORDER_NEW}>
   <HandleOrderPage />
   </Route>


   <Route path={routePath.ADD_MEMBER}>
   <AddMember />
   </Route>

   <Route path={routePath.REQUEST_ORDER}>
   <RequestOrder />
   </Route>

   * */
}

export { HomeRouter };
