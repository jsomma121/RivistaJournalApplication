import React, { Component } from "react";
import "./EditEntry.css";

export default class EditEntry extends Component {
    constructor(props) {
        super(props);
        
        this.pathName = this.props.location.pathname;
        this.entryTitle = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}"));

        this.state = {
        }
    }

    render() {
        return (
        <div className="header">
            <h2>this is edit entry page </h2>
            <h2>{this.entryTitle}</h2>
        </div>
    );
  }
}