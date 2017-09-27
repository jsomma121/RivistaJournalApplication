import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Rivista</h1>
          <p>The professional journal application</p>
          <Link to="/login">
            <div className="goButton">
              <p1>Click me!</p1>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}