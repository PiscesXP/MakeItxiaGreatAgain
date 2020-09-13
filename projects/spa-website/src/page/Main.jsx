import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { routePath } from "./routePath";
import { WCMS } from "./wcms";
import { CustomSystem } from "./custom";
import { NotFound } from "COMPONENTS/notFound";
import { OAuthPage } from "PAGE/oauth";

/**
 * 整个应用的router.
 * */
function Main() {
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
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export { Main };
