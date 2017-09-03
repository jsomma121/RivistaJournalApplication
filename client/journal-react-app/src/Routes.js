import React from "react";
import { Route, Switch } from "react-router-dom";
import { Home, Entry, History, Journal, Login, Register } from "./containers/";

export default() =>
    <Switch>
        <PropsRoute path="/" exact component={Home} props={childProps}/>
        <PropsRoute path="/login" exact component={Login} props={childProps}/>
        <Route path="/register" exact component={Register}/>
        <PropsRoute path="/journal/:id" exact component={Journal} props={childProps}/>
        <PropsRoute path="/entry/:id" exact component={Entry} props={childProps}/>
        <PropsRoute path="/history/:id" exact component={History} props={childProps}/>
    </Switch>