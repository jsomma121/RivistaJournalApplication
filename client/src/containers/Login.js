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
      error: ""
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
        onSuccess: result => { resolve() },
        onFailure: err => reject(err)
      })
    );
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      // API Call
      await this.login(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      this.setState({
        isLoading: false,
        error: "Incorrect email or password"
      });
    }
  }


  render() {
    return (
      <div>
        <br /><br />
        <div className={"card login-card " + this.props.theme.shadow} style={{ backgroundColor: this.props.theme.primary, color: this.props.theme.text }}>
          <h3 className="card-title  login-form-title">Login</h3>
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" bsSize="large">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                className={this.props.theme.input}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                className={this.props.theme.input}
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
            <p className="error">{this.state.error}</p>
            <p>Don't have an account? <Link to="/signup">Signup here</Link> </p>
            <Link to="/forgot">Forgot your password?</Link>
          </form>
        </div>
      </div>
    );
  }
}