import config from "../config";
import React, { Component } from "react";
import { Redirect } from 'react-router';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isLoading: false,
      password: "",
      redirect: false
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  login(email, password) {
      const userPool = new CognitoUserPool({
        UserPoolId: config.cognito.USER_POOL_ID,
        ClientId: config.cognito.APP_CLIENT_ID
      });
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authenticationData = { Username: email, Password: password };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      

      // Fetch the details and await response
      return new Promise((resolve, reject) =>
        user.authenticateUser(authenticationDetails, {
          onSuccess: result => {resolve()},
          onFailure: err => reject(err)
        })
      );
  }

  handleRedirect = () => {
    this.props.history.push("/journal");
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
  
    try {
      // API Call
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e);
    }
  }
  

  render() {
    
    // if ( this.redirect ) {
    //   return <Redirect to='/journal'/>;
    // }

    return (
      <div className="card login-card">
        <h3 className="card-title  login-form-title">Login</h3>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            className="btn-primary"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
          />
          <p>Don't have an account? <Link to="/signup">Signup here</Link> </p>
        </form>
      </div>
    );
  }
}