import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: component, props: childProps, ...rest }) =>
    <Route
        {...rest}
        render = {props =>
            childProps.isAuthenticated
                ?<component {...props} {...childProps} />
                : <Redirect
                    to={`/login?redirect=${props.location.pathname}${props.location.search}`}
                />}
    />;