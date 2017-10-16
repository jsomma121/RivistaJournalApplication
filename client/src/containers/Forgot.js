import React, { Component } from 'react';
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Link } from "react-router-dom";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import config from "../config";

export default class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailExists: false,
            code: "",
            password: "",
            isLoading: false,
            error: "",
            success: ""
        }
    }

    handleEmailSubmit = async event => {
        this.setState({
            isLoading: true
        })

        try {
            await this.forgotPassword(this.state.email);
            this.setState({
                emailExists: true,
                isLoading: false,
                error: ""
            })
        } catch (e) {
            this.setState({
                error: "Email does not exist",
                isLoading: false
            })
        }
    }

    handleNewPasswordSubmit = async event => {
        this.setState({
            isLoading: true
        })

        try {
            await this.confirmPassword(this.state.email, this.state.code, this.state.password);
            this.setState({
                success: "Password succesfully changed"
            })
            await this.props.sleep(250);
            this.props.history.push("/login");
        } catch (e) {
            this.setState({
                error: "Invalid code",
                isLoading: false
            })
        }
    }

    forgotPassword(email) {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });
        const user = new CognitoUser({ Username: email, Pool: userPool });
        return new Promise((resolve, reject) =>
            user.forgotPassword({
                onSuccess: result => { resolve() },
                onFailure: err => reject(err)
            })
        );
    }

    confirmPassword(email, code, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });
        const user = new CognitoUser({ Username: email, Pool: userPool });

        return new Promise((resolve, reject) => {
            user.confirmPassword(code, password, {
                onSuccess: result => { resolve() },
                onFailure: err => reject(err)
            })
        })
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    renderForm() {
        return (
            <div style={{ color: this.props.theme.text }}>
                <h1>Forgotten Password</h1>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Enter your Email:</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        className={this.props.theme.input}
                    />
                    <HelpBlock className="error">{this.state.error}</HelpBlock>
                </FormGroup>
                <Link to="/login"><button type="button" className="btn btn-primary">Cancel</button></Link>
                <button type="submit" className="btn" onClick={this.handleEmailSubmit}>Verify</button>
            </div>
        );
    }

    renderConfirmation() {
        return (
            <div style={{ color: this.props.theme.text }}>
                <h1>Confirm Password</h1>
                <FormGroup controlId="code" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.code}
                        onChange={this.handleChange}
                        className={this.props.theme.input}
                    />
                    <HelpBlock className="error">{this.state.error}</HelpBlock>
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>New Password</ControlLabel>
                    <FormControl
                        autoFocus
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        className={this.props.theme.input}
                    />
                </FormGroup>
                <p>{this.state.success}</p>
                <button type="submit" className="btn" onClick={this.handleNewPasswordSubmit}>Submit</button>
            </div>
        );
    }

    render() {
        return this.state.emailExists ? this.renderConfirmation() : this.renderForm();
    }
}