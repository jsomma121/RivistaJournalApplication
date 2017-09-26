import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Entry.css";

export default class Entry extends Component {
  constructor(props) {
    super(props);
    //just a test entry list
    this.entryLists = [
      "Test entry title 1",
      "Test entry title 2",
      "Test entry title 3",
      "Test entry title 4",
      "Test entry title 5",
      "Test entry title 6"];
      
    this.state = {
      EntryName: "",
      isLoading: false
    }
  }

  validateForm() {
    return this.state.EntryName.length > 0;
  }

  handleChange = event => {
    this.setState({
      EntryName: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.entryLists.push(this.state.EntryName);
    this.setState({ EntryName: "" });
  }

  render() {

    var path = this.props.location.pathname;

    return (
      <div>
        <div className="header">
          <p>Entries</p>
        </div>

        {/* Create new entry nav bar */}
        <div className="modal fade" id="newEntryModal" role="dialog" aria-labelledby="newEntryModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newEntryModalLabel">Create an Entry</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="newEntryName">Name</label>
                    <input type="text" className="form-control" id="newEntryName" placeholder="Enter entry name" value={this.state.value} onChange={this.handleChange} />
                  </div>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <LoaderButton
                    type="submit"
                    isLoading={this.state.isLoading}
                    disabled={!this.validateForm()}
                    className="btn-primary"
                    text="Create Entry"
                    loadingText="Creating..." />
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Create new entry nav bar */}
        
      </div>
    );
  }
}