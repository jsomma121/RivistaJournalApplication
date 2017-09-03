import React from "react";
import Route from "react-router-dom";

export default ({ component: component, props: childProps, ...rest}) =>
    <Route {...rest} render={props => <component {...props} {...childProps}/>}/>;