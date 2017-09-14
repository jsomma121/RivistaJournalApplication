import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home"
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
<<<<<<< HEAD
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
=======
import NewJournal from "./containers/NewJournal"; 
>>>>>>> 9f410e4783db50b872956412fcd5568290ec5b37

export default ({ childProps }) =>
<Switch>
  <AppliedRoute path="/" exact component={Home} props={childProps} />
<<<<<<< HEAD
  <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
=======
  <AppliedRoute path="/login" exact component={Login} props={childProps} />
  <AppliedRoute path="/journal/new" exact component={NewJournal} props={childProps} />
>>>>>>> 9f410e4783db50b872956412fcd5568290ec5b37
  { /* Finally, catch all unmatched routes */ }
  <Route component={NotFound} />
</Switch>;