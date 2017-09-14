import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home"
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import NewJournal from "./containers/NewJournal";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/journal/new" exact component={NewJournal} props={childProps} />
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;