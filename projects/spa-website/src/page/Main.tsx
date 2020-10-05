import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { routePath } from "./routePath";
import { WCMS } from "./wcms";
import { CustomSystem } from "./custom";
import { PageNotFound } from "@/components/notFound";
import { OAuthPage } from "@/page/oauth";

/**
 * 整个应用的router.
 * */
export const Main = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={routePath.CUSTOM} />
        </Route>
        <Route path={routePath.WCMS}>
          <WCMS />
        </Route>
        <Route path={routePath.CUSTOM}>
          <CustomSystem />
        </Route>
        <Route path={routePath.OAUTH}>
          <OAuthPage />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
