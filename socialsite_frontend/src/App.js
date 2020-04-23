import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//import Users from "./users/pages/Users";
import MainNavigation from "./shared/components/MainNavigation";
//import UserPlaces from "./places/pages/UserPlaces";
//import UpdatePlace from "../src/places/pages/UpdatePlace";
//import Auth from "./users/pages/Auth";
import { AuthContext } from "../src/shared/context/auth-context";
import { useAuth } from "./shared/Hooks/auth-hook";
import LoadingSpinner from "./shared/components/LoadingSpinner";
//import NewPlaces from "./places/pages/NewPlace";
const Users = React.lazy(() => import("./users/pages/Users"));
const NewPlaces = React.lazy(() => import("./places/pages/NewPlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));
const UserPlaces = React.lazy(() => import("../src/places/pages/UpdatePlace"));
const UpdatePlace = React.lazy(() => import("../src/places/pages/UpdatePlace"));
const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>

        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact={true}>
          <Users />
        </Route>

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/auth">
          <Auth />
        </Route>

        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner overlay />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};
//rendering is done from top to bottom
//<Switch> it stops there where it finds required router & doesnot goes down till end

// React renders full component first then it renders useEffect

//to add environment variable we have to use %variablename% both sided
export default App;
/* <Route path="/" exact={true}>
              <Users />
            </Route>
            <Route path="/:userId/places" exact>
              <UserPlaces />
            </Route>
            <Route path="/places/new" exact>
              <NewPlaces />
            </Route>
            <Route path="/places/:placeId">
              <UpdatePlace />
            </Route>
            <Route path="/auth">
              <Auth />
            </Route>
            <Redirect to="/" />
          </Switch>
*/
