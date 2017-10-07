import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home"
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Signup from "./containers/Signup"; 
import Entry from "./containers/Entry";
import EditEntry from "./containers/EditEntry";
import EntryHistory from "./containers/EntryHistory";


export default ({ childProps }) =>
<Switch>
  <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
  <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
  <AppliedRoute path="/" exact component={Home} props={childProps} />
  <AppliedRoute path="/entry/:journalId" exact component={Entry} props={childProps}/>
  <AppliedRoute path="/editEntry/new" exact component={EditEntry} props={childProps}/>
  <AppliedRoute path="/editEntry/:entryId" exact component={EditEntry} props={childProps}/>
  <AppliedRoute path="/entry/history/:entryId" exact component={EntryHistory} props={childProps}/>
  { /* Finally, catch all unmatched routes */ }
  <Route component={NotFound} />
</Switch>;
