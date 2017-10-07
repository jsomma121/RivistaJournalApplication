import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import LoaderButton from "../components/LoaderButton";
import Toggle from 'react-toggle'
import Octoicon from 'react-octicon';
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
	console.log(this.props.journal);
	if (this.props.journal.length > 0) {
		var journal = this.getJournal();
		console.log(journal);
		this.props.updateChildProps({
			currentEntry: null,
			currentJournal: journal,
			currentEntryRevision: null
		});
		console.log(this.props.journal);
	}
	
    this.state = {
<<<<<<< HEAD
      isLoading: false,
=======
      EntryName: "",
      isLoading: true,
>>>>>>> master
      deleteSelected: "",
      searchText: "",
      startDate: null,
      endDate: null,
      showHidden: false,
      showDeleted: false,
<<<<<<< HEAD
      showFilter: false,
      data: [],
      eggsAreReady: false
=======
      entries: [],
      filteredEntries: [],
>>>>>>> master
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

<<<<<<< HEAD
  componentWillMount() {
    this.getDummyData();
  }

  handleDelete(entry) {
=======
  getJournal(){
	var journal = this.props.journal;
	for (var i = 0; i < journal.length; i++ ) {
		if(journal[i].journalid === this.props.match.params.journalId) {
			return journal[i];
		}
	
	}

	return null;

  }

  handleSelete(select) {
>>>>>>> master
    this.setState({
      deleteSelected: entry
    });
  }

<<<<<<< HEAD
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
=======
  componentWillReceiveProps(nextProps) {
	if(this.state.isLoading){
		var journal = this.getJournal();
		this.props.updateChildProps({
			currentEntry: null,
			currentJournal: journal,
			currentEntryRevision: null
		});
		this.setState({isLoading: false});
	}
	
}

  handleDelete(data) {
    for (var i = 0; i < this.entryLists.length; i++) {
      if (this.entryLists[i] == data) {
        this.entryLists.splice(i, 1);
        break;
      }
>>>>>>> master
    }
    this.setState({
      endDate: date
    })
  }

  handleHiddenChange() {
    this.setState({
      showHidden: !this.state.showHidden,
      showAll: false
    })
  }

  handleDeletedChange() {
    this.setState({
      showDeleted: !this.state.showDeleted,
      showAll: false
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
        state: "active",
        createdDate: 1500991200000,
        lastUpdated: 1501077600000
      })
    }

    entryLists.push({
      title: "Test",
      state: "active",
      createdDate: 1500991200000,
      lastUpdated: 1501250400000
    })

    entryLists.push({
      title: "Deleted Entry",
      state: "deleted",
      createdDate: 1501336800000,
      lastUpdated: 1501423200000
    })

    entryLists.push({
      title: "Hidden Entry",
      state: "hidden",
      createdDate: 1501336800000,
      lastUpdated: 1501423200000
    })

    this.setState(
      { data: entryLists }
    )
  }

  deleteButton(entry) {
    return (
      <button type="button" className="btn btn-link" data-toggle="modal" data-target="#deleteModal" onClick={() => { this.handleDelete(entry.title) }} disabled={entry.state === "deleted"}>Delete</button>
    )
  }

  filterHiddenAndDeleted(entry) {
    if (!this.state.showHidden && !this.state.showDeleted) {
      if (entry.state === "active") {
        return entry;
      }
      return null;
    } else {
      if (this.state.showHidden && this.state.showDeleted) {
        return entry;
      } else if (this.state.showHidden) {
        if (entry.state === "hidden" || entry.state === "active") {
          return entry;
        }
        return null;
      } else {
        if (entry.state === "deleted" || entry.state === "active") {
          return entry;
        }
        return null;
      }
    }
  }

  filterEntries() {
    var entries = this.state.data;
    var filteredEntries = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = this.filterHiddenAndDeleted(entries[i]);
      if (entry != null) {
        filteredEntries.push(entry);
      }
    }
    return filteredEntries;
  }

  searchEntries() {
    var entries = this.state.data;
    var filteredEntries = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = this.filterHiddenAndDeleted(entries[i]);
      if (entry != null) {
        if (entries[i].title.includes(this.state.searchText)) {
          console.log("huh?");
          if (this.state.startDate != null && this.state.endDate != null) {
            console.log(entries[i].title + ": ");
            console.log(entries[i].lastUpdated >= this.state.startDate && entries[i].lastUpdated <= this.state.endDate);
            if (entries[i].lastUpdated >= this.state.startDate && entries[i].lastUpdated <= this.state.endDate) {
              filteredEntries.push(entries[i]);
            }
          }
          else if (this.state.startDate != null) {
            console.log("Search: " + this.state.startDate + " Entry: " + entries[i].lastUpdated);
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
        <label className="form-check-label">
          <input type="checkbox" className="form-check-input" onChange={this.handleDeletedChange.bind(this, "showDeleted")} checked={this.state.showDeleted} />
          Show deleted
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
            <li><button type="button" className="btn btn-link" disabled={e.state === "deleted"}>{e.state === "hidden" ? "Unhide" : "Hide"}</button></li>
            <li><button type="button" className="btn btn-link">History</button></li>
          </ul>
          <div className="entry-details">
            <Link to="/editEntry/:{this-should-be-entryID}" className="card-link">
              <div className="entry-title">
                <h3>{e.title}</h3>
                {e.state === "hidden" ? <h4 className="subtitle hidden">Hidden</h4> : ""}
                {e.state === "deleted" ? <h4 className="subtitle deleted">Deleted</h4> : ""}
              </div>
              <div className="entry-date">
                <p>Last updated: {moment(e.lastUpdated).format("hh:mmA DD MMMM YYYY")}</p>
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
    var pageTitle = this.journalTitle + " Entries";
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
        <div>
          <div>
            <div className="hiddenToggle">
              <Toggle
                defaultChecked={this.state.eggsAreReady}
                aria-labelledby='biscuit-label'
                onChange={this.handleHiddenChange.bind(this, "showHidden")}
              />
            </div>
            <p className="hiddenToggleText">Hidden</p>
          </div>
          <div>
            <div className="deletedToggle">
              <Toggle
                defaultChecked={this.state.eggsAreReady}
                aria-labelledby='biscuit-label'
                onChange={this.handleDeletedChange.bind(this, "showDeleted")}
              />
            </div>
            <p className="deletedToggleText">Deleted</p>
          </div>
        </div>
        <div id="search" className="input-group">
          <input type="text" placeholder="Search..." onChange={this.handleSearchChange} value={this.state.searchText} />
          <Octoicon className="search-icon" name="search" />
          <span className="input-group-btn">
            <button className="btn btn-secondary" type="button" onClick={e => this.toggleFilter(e)}><Octoicon name="settings" /></button>
          </span>
        </div>
        <Link to="/" className="linkText">
<<<<<<< HEAD
          <div className="return">
            <p className="backFont">Back to Journals</p>
            <Octoicon mega name="arrow-left" />
=======
          <div className="return"> 
            <p>Back to Journals</p>
            <Octoicon mega name="mail-reply"/>
>>>>>>> master
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
      </div >
    );
  }
}
