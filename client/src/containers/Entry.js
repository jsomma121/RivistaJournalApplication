import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import Octoicon from 'react-octicon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./Entry.css";

export default class Entry extends Component {
  constructor(props) {
    super(props);

    this.pathName = this.props.location.pathname;
    this.journalTitle = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}"));

    this.state = {
      isLoading: false,
      deleteSelected: "",
      searchText: "",
      startDate: "",
      endDate: "",
      showHidden: false,
      showDeleted: false,
      showFilter: false,
      data: []
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  componentWillMount() {
    this.getDummyData();
    //this.filterEntries();
  }

  handleDelete(entry) {
    this.setState({
      deleteSelected: entry
    });
  }

  handleSearchChange = event => {
    this.setState({
      searchText: event.target.value
    })
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date
    })
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
    })
  }

  handleHiddenChange() {
    this.setState({
      showHidden: !this.state.showHidden
    })
  }

  handleDeletedChange() {
    this.setState({
      showDeleted: !this.state.showDeleted
    })
  }

  toggleFilter() {
    this.setState({
      showFilter: !this.state.showFilter
    })
    console.log("it works?")
  }

  getDummyData() {
    var entryLists = [];
    for (var i = 1; i < 8; i++) {
      entryLists.push({
        title: "Entry #" + i,
        hidden: false,
        deleted: false,
        createdDate: "26-07-2017",
        lastUpdated: "27-07-2017"
      })
    }

    entryLists.push({
      title: "Hidden Entry",
      hidden: true,
      deleted: false,
      createdDate: "30-07-2017",
      lastUpdated: "31-07-2017"
    })

    this.setState(
      { data: entryLists }
    )
  }

  deleteButton(name) {
    return (
      <button type="button" className="btn btn-link" data-toggle="modal" data-target="#deleteModal" onClick={() => { this.handleDelete(name) }}>Delete</button>
    )
  }

  filterEntries() {
    var entries = this.state.data;
    console.log(entries);
    var filteredEntries = [];
    for (var i = 0; i < entries.length; i++) {
      console.log(entries[i].hidden);
      if (!entries[i].hidden && !entries[i].deleted) {
        filteredEntries.push(entries[i]);
      }
    }
    return filteredEntries;
  }

  searchEntries() {
    var entries = this.state.data;
    var filteredEntries = [];
    console.log(this.state.showHidden);
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].title.includes(this.state.searchText) && entries[i].hidden === this.state.showHidden && entries[i].deleted === this.state.showDeleted) {
        filteredEntries.push(entries[i]);
      }
    }
    return filteredEntries;
  }

  renderFilter() {
    return (
      <div className="filter">
        <h3>Date</h3>
        <DatePicker
          selected={this.state.startDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeStart}
        />
        to
        <DatePicker
          selected={this.state.endDate}
          selectsEnd
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeEnd}
        />
        <label className="form-check-label">
          <input type="checkbox" className="form-check-input" onChange={this.handleHiddenChange.bind(this, "showHidden")}/>
          Show hidden
        </label>
        <label className="form-check-label">
          <input type="checkbox" className="form-check-input" onChange={this.handleDeletedChange.bind(this, "showDeleted")}/>
          Show deleted
        </label>
      </div>
    )
  }

  renderEntries() {
    var entries;
    console.log("isHidden: " + this.state.showHidden + " isDeleted: " + this.state.showDeleted);
    if (this.state.searchText.length > 0 || this.state.showHidden || this.state.showDeleted) {
      console.log("Got from search");
      entries = this.searchEntries();
    } else {
      console.log("No search")
      entries = this.filterEntries();
    }
    console.log("hi")
    return [{}].concat(entries).map(
      (e, i) =>
        <div key={i} className="card journal-card entry-card">
          <div className="options">
            {this.deleteButton(e.title)}
            <button type="button" className="btn btn-link">Hide</button>
            <button type="button" className="btn btn-link">History</button>
          </div>
          <div className="entry-details">
            <Link to="/test" className="card-link">
              <div className="entry-title">
                <h3>{e.title}</h3>
              </div>
              <div className="entry-date">
                <p>{e.lastUpdated}</p>
              </div>
            </Link>
          </div>
        </div>
    );
  }

  render() {
    var pageTitle = this.journalTitle + " Entries";
    let filter = null;
    if (this.state.showFilter) {
      filter = this.renderFilter();
    }
    return (
      <div>
        {filter}        
        <div id="search" className="input-group">
          <input type="text" placeholder="Search..." onChange={this.handleSearchChange} value={this.state.searchText} />
          <Octoicon className="search-icon" name="search" />
          <span className="input-group-btn">
            <button className="btn btn-secondary" type="button" onClick={e => this.toggleFilter(e)}><Octoicon name="settings" /></button>
          </span>
        </div>
        <Link to="/" className="linkText">
          <div className="return">
            <p>Back to Journals</p>
            <Octoicon mega name="arrow-left" />
          </div>
        </Link>
        <div className="header">
          <h1> {pageTitle}</h1>
        </div>

        <div className="cards">
          {this.renderEntries()}
        </div>

        <div className="modal fade" id="deleteModal" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Delete {this.state.deleteSelected}?</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {this.state.deleteSelected}</p>
                <form onSubmit={this.handleSubmit}>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <LoaderButton
                    type="submit"
                    isLoading={this.state.isLoading}
                    className="btn-danger"
                    text="Delete"
                    loadingText="Creating..." />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}