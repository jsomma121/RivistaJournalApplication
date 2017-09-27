import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home"
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import NewJournal from "./containers/NewJournal";
import Signup from "./containers/Signup"; 
import Journal from "./containers/Journal";
import Entry from "./containers/Entry";
import EditEntry from "./containers/EditEntry";

export default ({ childProps }) =>
<Switch>
  <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
  <AppliedRoute path="/journal/new" exact component={NewJournal} props={childProps} />
  <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
  <AppliedRoute path="/" exact component={Journal} props={childProps} />
  <AppliedRoute path="/entry/:pathName" exact component={Entry} props={childProps}/>
  <AppliedRoute path="/editEntry/:entryName" exact component={EditEntry} props={childProps}/>
  { /* Finally, catch all unmatched routes */ }
  <Route component={NotFound} />
</Switch>;
