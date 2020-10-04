import React from "react";
import { routePath } from "./routePath";
import { Route, Switch } from "react-router-dom";
import { RequestOrder } from "COMPONENTS/requestOrder";
import { CustomHomePage } from "page/custom/home";
import { NotFound } from "COMPONENTS/notFound/PageNotFound";

function CustomRouter() {
  return (
    <Switch>
      <Route path={routePath.CUSTOM_HOME}>
        <CustomHomePage />
      </Route>
      <Route path={routePath.CUSTOM_ORDER}>
        <RequestOrder />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export { CustomRouter };
