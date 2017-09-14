import React from "react";
import { Route, Redirect } from "react-router-dom";

function queryString(name, url = window.location.href) {
    name = name.replace(/[[]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);

    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default ({ component: component, props: childProps, ...rest }) => {
    const redirect = queryString("redirect");
    return (
        <Route
            {...rest}
            render={props =>
                !childProps.isAuthenticated
                    ? <component {...props}{...childProps} />
                    : <Redirect
                        to={redirect === "" || redirect === null ? "/" : redirect}
                    />}
        />
    );
}
