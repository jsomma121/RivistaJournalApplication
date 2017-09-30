import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Link } from "react-router-dom";
import { invokeApig } from "../libs/awsLib"; 
import Octoicon from 'react-octicon';
import config from "../config";
import "./NewJournal.css";

export default class NewJournal extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            isLoading: null,
            journalTitle: ""
        };
    }

    validateForm() {
        return this.state.journalTitle.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        }); 
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleSubmit = async event => {
        event.preventDefault();
      
        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
          alert("Please pick a file smaller than 5MB");
          return;
        }
      
        this.setState({ isLoading: true });
      
        try {
          const data = await this.createJournal({
            journalTitle: this.state.journalTitle
          });
          this.props.history.push("/");
        } catch (e) {
          this.setState({ isLoading: false });
        }
      }
      
      createJournal(journal) {
        return invokeApig({
          path: "/journal",
          method: "POST",
          body: journal
        });
      }
            
    render() {
        return (
            <div className="NewJournal">
                <form onSubmit={this.handleSubmit}>
                    <Link to="/" className="linkText">
                        <div className="return">
                        <p>Back to Journals</p>
                        <Octoicon mega name="mail-reply"/>
                        </div>
                    </Link>
                    <h1>New Journal</h1>
                    <FormGroup controlId="journalTitle">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.journalTitle}
                        componentClass="textarea"
                      />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        );
    }
}