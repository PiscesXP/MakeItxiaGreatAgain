import React, { useEffect } from "react";
import { routePath } from "./routePath";
import { Login } from "COMPONENTS/login";
import { Home } from "COMPONENTS/home";
import { Recovery } from "COMPONENTS/recovery";
import { UserInfoProvider } from "CONTEXT/UserInfo";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { NotFound } from "COMPONENTS/notFound";
import { CustomHomeLayout } from "page/custom/home";
import { mapPathnameToTitle } from "./mapPathnameToTitle";

function TopLevelRouter() {
  //根据pathname，更新title
  const location = useLocation();
  useEffect(() => {
    document.title = mapPathnameToTitle(location.pathname);
  }, [location]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={routePath.CUSTOM_HOME} />
      </Route>

      <Route path={routePath.LOGIN}>
        <Login />
      </Route>

      <Route path={routePath.RECOVERY}>
        <Recovery />
      </Route>

      <Route path={routePath.CUSTOM}>
        <CustomHomeLayout />
      </Route>

      <Route path={routePath.HOME}>
        <UserInfoProvider>
          <Home />
        </UserInfoProvider>
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function MainRouter() {
  return (
    <Router>
      <TopLevelRouter />
    </Router>
  );
}

export { MainRouter };
