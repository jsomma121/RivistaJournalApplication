import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import LoaderButton from "../components/LoaderButton";
import Toggle from 'react-toggle'
import Octoicon from 'react-octicon';
import { invokeApig } from '../libs/awsLib';
import Ink from 'react-ink';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import "./Entry.css";
import "react-toggle/style.css"

export default class Entry extends Component {
  constructor(props) {
    super(props);

    this.pathName = this.props.location.pathname;
    this.journalTitle = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}"));
    this.state = {
      isLoading: true,
      deleteSelected: "",
      title: "",
      searchText: "",
      startDate: null,
      endDate: null,
      showHidden: false,
      showDeleted: false,
      showFilter: false,
      eggsAreReady: false,
      currentJournal: null
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    
  }

  getJournal() {
    var journals = this.props.journal;
    for (var i = 0; i < journals.length; i++) {
      console.log(journals[i].journalid);
      console.log(this.props.match.params.journalId);
      console.log(journals[i].journalid === this.props.match.params.journalId);
      if (journals[i].journalid === this.props.match.params.journalId) {
        return journals[i];
      }
    }
    return null;
  }

  updateJournal(journal) {
    try {
      const update = invokeApig({
        path: "/journal/" + journal.journalid,
        method: "PUT",
        body: {enteries: journal.enteries}
      });
      console.log
    } catch (e) {
      this.setState({ isLoading: false });
      }
  }

  componentWillMount() {
    if (this.state.isLoading) {
      var journal = this.getJournal();      
      if (journal != null) {
        this.setState({
          currentJournal: journal,
          title: journal.journalTitle
        });
        this.props.updateChildProps({
          currentEntry: null,
          currentJournal: journal,
          currentEntryRevision: null
        });
        this.setState({ isLoading: false });
      }      
    }
  }

  componentDidUpdate() {
    if (this.state.isLoading) {
      var journal = this.getJournal();    
      console.log(this.props.journal);
      if (journal != null) {
        console.log("got");
        this.setState({
          currentJournal: journal,
          title: journal.journalTitle
        });
        this.props.updateChildProps({
          currentEntry: null,
          currentJournal: journal,
          currentEntryRevision: null
        });
        this.setState({ isLoading: false});
      }
    }
  }

  validateForm() {
    return this.state.EntryName.length > 0;
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
    if (date != null && moment(date).format("hh:mmA") === "12:00AM") {
      date = moment(date).add(23, "h").add(59, "m")
    }
    this.setState({
      endDate: date
    })
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      const data = await this.createJournalEntry({
        journalTitle: this.state.journalTitle
      });
      //TO-DO - deal with the close modal problem
      this.props.onRequestHide();
      return
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  createJournalEntry(data) {
    
  }

  toggleFilter() {
    this.setState({
      showFilter: !this.state.showFilter
    })
    console.log("it works?")
  }

  // Active Method
  handleActive(data) {
    var entries = this.state.currentJournal.enteries;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].title == data) {
        entries[i].state = 'active';
        // TO-DO: Add a listner to the toggle button when this updates
        this.forceUpdate();
        break;
      }
    }
    return null;
  }

  // Handle methods
  handleHide(data) {
    var entries = this.state.currentJournal.enteries;
    
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].title == data) {
        entries[i].state = 'hidden';
        this.forceUpdate();
        break;
      }
    }
    return null;
  }

  hideAndUnhideButton(entry) {
    if(entry.state == 'hidden') {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleActive(entry.title) }}>Unhide</button>
      )
    } else {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleHide(entry.title) }}>Hide</button>
      )
    }
  }
  
  handleHiddenChange() {
    this.setState({
      showHidden: !this.state.showHidden,
      showAll: false
    })
  }

  // Delete methods
  deleteButton(entry) {
    return (
      <button type="button" className="btn btn-link" data-toggle="modal" data-target="#deleteModal" onClick={() => { this.handleDelete(entry.entryId) }} disabled={entry.state === "deleted"}>Delete</button>
    )
  }

  handleDeletedChange() {
    this.setState({
      showDeleted: !this.state.showDeleted,
      showAll: false
    })
  }

  handleDelete(data) {
    var entries = this.state.currentJournal.enteries;
    // const hello = entries.map((val) => {
    //   console.log(val.entryId);
    //   console.log(data);
    //   if (val.entryId == data) {
    //     val.state == 'delete';
    //   }
    // })
    // console.log(hello);
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].entryId == data) {
        entries[i].state = 'deleted';
        const update = this.updateJournal(this.state.currentJournal);
        break;
      }
    }
    return null;
  }

  filterHidden(entry) {
    if(entry.state == 'active') {
      return entry;
    }
      // if (!this.state.showHidden ) {
      //   if (this.state.showHidden) {
          
      //   } else if (this.state.showHidden) {
      //     if (entry.state === "hidden" || entry.state === "active") {
      //       return entry;
      //     }
      //     return null;
      //   } else {
      //     return entry;
      //   }
      // }
  }

  filterEntries() {
    var filteredEntries = [];
    if (this.state.currentJournal != null) {
      var entries = this.state.currentJournal.enteries;   
      for (var i = 0; i < entries.length; i++) {
        var entry = this.filterHidden(entries[i]);
        if (entry != null) {
          filteredEntries.push(entry);
        }
      }
    }    
    return filteredEntries;
  }

  searchEntries() {
    var entries = this.state.currentJournal.enteries;
    var filteredEntries = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = this.filterHidden(entries[i]);
      if (entry != null) {
        if (entries[i].title.includes(this.state.searchText)) {
          if (this.state.startDate != null && this.state.endDate != null) {
            if (entries[i].lastUpdated >= this.state.startDate && entries[i].lastUpdated <= this.state.endDate) {
              filteredEntries.push(entries[i]);
            }
          }
          else if (this.state.startDate != null) {
            if (moment(entries[i].lastUpdated).format("DDMMYYYY") === moment(this.state.startDate).format("DDMMYYYY")) {
              filteredEntries.push(entries[i]);
            }
          } else if (this.state.endDate != null) {
            if (entries[i].lastUpdated < this.state.endDate) {
              filteredEntries.push(entries[i]);
            }
          } else {
            filteredEntries.push(entries[i]);
          }
        }
      }
    }
    return filteredEntries;
  }

  renderFilter() {
    return (
      <div className="filter">
        <h3>Date</h3>
        <div className="filter-dates">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            isClearable={true}
            dateFormat="DD MMMM YYYY"
          />
          <p>to</p>
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            isClearable={true}
            dateFormat="DD MMMM YYYY"
          />
        </div>

        <label className="form-check-label">
          <input type="checkbox" className="form-check-input" onChange={this.handleHiddenChange.bind(this, "showHidden")} checked={this.state.showHidden} />
          Show hidden
        </label>
        <button type="button" className="close" onClick={e => this.toggleFilter(e)}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }

  renderEntries() {
    var entries;
    if (this.state.searchText.length > 0 || this.state.startDate != null || this.state.endDate != null) {
      entries = this.searchEntries();
    } else {
      entries = this.filterEntries();
    }
    return entries.map(
      (e, i) =>
        <div key={i} className="card journal-card entry-card btn btn-success" id="testFun">
          <ul className="options" id="optionsNew">
            <li>{this.deleteButton(e)}</li>
            <li>{this.hideAndUnhideButton(e)}</li>
            <li><button type="button" className="btn btn-link">History</button></li>
          </ul>
          <div className="entry-details">
            <Link to={'/editEntry/' + e.entryId} className="card-link">
              <div className="entry-title">
                <h3>{e.title}</h3>
                {e.state === "hidden" ? <h4 className="subtitle hidden">Hidden</h4> : ""}
                {e.state === "deleted" ? <h4 className="subtitle deleted">Deleted</h4> : ""}
              </div>
              <div className="entry-date">
                <p>Last updated: {e.updatedAt}</p>
              </div>
            </Link>
          </div>
        </div>
    );
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    let filter = null;
    if (this.state.showFilter) {
      filter = this.renderFilter();
    }

    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      toggle: <button type="button" onClick={this.toggle}>Click me!</button>,
      align: 'right'
    };
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
            <p className="backFont">Back to Journals</p>
            <Octoicon mega name="arrow-left" />
          </div>
        </Link>

        <div>
          <div className="header">
            <h1> {this.state.title}</h1>
          </div>

          <div className="toggleButtons">
            <div className="hiddenT">
              <pre className="hiddenToggleText">Hidden </pre>
              <div className="hiddenToggle">
                <Toggle
                  defaultChecked={this.state.eggsAreReady}
                  aria-labelledby='biscuit-label'
                  onChange={this.handleHiddenChange.bind(this, "showHidden")}
                />
              </div>
            </div>
          </div>
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
      </div >
    );
  }
}