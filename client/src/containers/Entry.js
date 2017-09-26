import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import LeftArrowIcon from 'react-icons/lib/fa/arrow-left'
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

    this.pathName = this.props.location.pathname;
    this.journalTitle = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}"));

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

    var pageTitle = this.journalTitle + " Entries";

    var data = this.entryLists;
    var cards = [];
    for (var i = 0; i < data.length; i++) {
      var pathName = "/entry/entryname" + "${" + data[i] + "}";
      cards.push(
        <div key={i} className="entryCards">
          <div className="leftOptions">
            <div className="optionsTable">
              <div className="deleteOption">
                <p>Delete</p>
              </div>
              <div className="hiddenOption">
                <p>Hidden</p>
              </div>
              <div className="historyOption">
                <p>History</p>
              </div>
            </div>
          </div>

          <div className="entryDetails">
            <div className="entryTitle">
              <h3>{data[i]}</h3>
            </div>
            <div className="entrySubtitle">
              <p>Last Updated: 8.40pm 27-09-2017</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="header">
          <Link to="/" className="linkText">
            <div className="returnIcon">
              <p><LeftArrowIcon /></p>
            </div>
            <div className="returnText">
              <p>Back to Journals</p>
            </div>
          </Link>
          <div className="headerText">
            <p>{pageTitle}</p>
          </div>
        </div>

        <div className="cards">
          {cards}
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