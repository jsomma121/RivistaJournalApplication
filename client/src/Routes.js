import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home"
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import NewJournal from "./containers/NewJournal";
import Signup from "./containers/Signup"; 
import JournalList from "./containers/JournalList";
import Entry from "./containers/Entry";

export default ({ childProps }) =>
<Switch>
  <AppliedRoute path="/" exact component={Home} props={childProps} />
  <AppliedRoute path="/login" exact component={Login} props={childProps} />
  <AppliedRoute path="/journal/new" exact component={NewJournal} props={childProps} />
  <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
  <AppliedRoute path="/journalList" exact component={JournalList} props={childProps} />
  <AppliedRoute path="/entry" exact component={Entry} props={childProps} />
  { /* Finally, catch all unmatched routes */ }
  <Route component={NotFound} />
</Switch>;
