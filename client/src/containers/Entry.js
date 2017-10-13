import React, { Component } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import { Modal } from 'react-bootstrap';
import LoaderButton from "../components/LoaderButton";
import Toggle from 'react-toggle'
import Octoicon from 'react-octicon';
import { invokeApig } from '../libs/awsLib';
import { ModalContainer, ModalDialog } from "react-modal-dialog";
import Ink from 'react-ink';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import $ from 'jquery';
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
      deleteLoading: false,
      deleteSelected: "",
      searchText: "",
      startDate: null,
      endDate: null,
      showHidden: false,
      showDeleted: false,
      showFilter: false,
      showModal: false,
      eggsAreReady: false,
      currentJournal: null
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);

  }

  getJournal() {
    var journals = this.props.journal;
    for (var i = 0; i < journals.length; i++) {
      if (journals[i].journalid === this.props.match.params.journalId) {
        journals[i].enteries.sort((a,b) => {
          return moment(b.updatedAt) - moment(a.updatedAt);
        })
        return journals[i];
      }
    }
    return null;
  }

  async update() {
    try {
      const data = await this.updateJournal(this.state.currentJournal);
    } catch (e) {
      this.setState({ isLoading: false });
    }
    await this.props.sleep(250);
    this.props.handleUpdate({ state: true });
    await this.props.sleep(250);
    this.setState({
      isLoading: true,
      deleteLoading: false
    })
  }

  updateJournal(journal) {
    try {
      const update = invokeApig({
        path: "/journal/" + journal.journalid,
        method: "PUT",
        body: { enteries: journal.enteries }
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
    if (this.state.isLoading && !this.props.isLoading) {
      var journal = this.getJournal();
      console.log(this.props.journal);
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
    this.setState({ deleteLoading: true });
    var entries = this.state.currentJournal.enteries;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].entryId == this.state.deleteSelected.entryId) {
        entries[i].state = 'deleted';
        break;
      }
    }

    this.update();
    this.setState({
      deleteLoading: false
    })
    this.close();
  }

  toggleFilter() {
    this.setState({
      showFilter: !this.state.showFilter
    })
  }

  // Active Method
  handleActive(data) {
    var entries = this.state.currentJournal.enteries;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].entryId == data) {
        entries[i].state = 'active';
        // TO-DO: Add a listner to the toggle button when this updates
        this.forceUpdate();
        break;
      }
    }
    this.update();
    return null;
  }

  // Handle methods
  handleHide(data) {
    var entries = this.state.currentJournal.enteries;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].entryId === data) {
        console.log(entries[i].state);
        entries[i].state = 'hidden';
        console.log(entries[i].state);
        this.forceUpdate();
        break;
      }
    }
    this.update();
  }

  hideAndUnhideButton(entry) {
    if (entry.state == 'hidden') {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleActive(entry.entryId) }} disabled={entry.state === "deleted"}>Unhide</button>
      )
    } else {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleHide(entry.entryId) }} disabled={entry.state === "deleted"}>Hide</button>
      )
    }
  }

  handleHiddenChange() {
    this.setState({
      showHidden: !this.state.showHidden
    })
  }

  // Delete methods
  deleteButton(entry) {
    return (
      <button type="button" className="btn btn-link" data-toggle="modal" data-target="#deleteModal" onClick={() => { this.handleDelete(entry) }} disabled={entry.state === "deleted"}>Delete</button>
    )
  }

  handleDeletedChange() {
    this.setState({
      showDeleted: !this.state.showDeleted
    })
  }

  handleDelete(data) {
    this.setState({
      deleteSelected: data,
      showModal: true
    })
  }

  filterHidden(entry) {
    if (!this.state.showHidden && !this.state.showDeleted) {
      if (entry.state === "active") {
        return entry;
      }
    } else {
      if (this.state.showHidden && this.state.showDeleted) {
        return entry;
      } else if (this.state.showHidden) {
        if (entry.state === "hidden" || entry.state === "active") {
          return entry;
        }
      } else {
        if (entry.state === "deleted" || entry.state === "active") {
          return entry;
        }
      }
    }
    return null;
  }

  sortEntries(order) {
    if (order === "oldest") {
      this.state.currentJournal.enteries.sort((a, b) => {
        return moment(a.updatedAt) - moment(b.updatedAt);
      })
    } else {
      this.state.currentJournal.enteries.sort((a, b) => {
        return moment(b.updatedAt) - moment(a.updatedAt);
      })
    }
    this.setState({
      showFilter: false
    })
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
            if (moment(entries[i].createdAt).format("x") >= moment(this.state.startDate).format("x") && moment(entries[i].createdAt).format("x") <= moment(this.state.endDate).format("x")) {
              filteredEntries.push(entries[i]);
            }
          }
          else if (this.state.startDate != null) {
            if (moment(entries[i].createdAt).format("DDMMYYYY") === moment(this.state.startDate).format("DDMMYYYY")) {
              filteredEntries.push(entries[i]);
            }
          } else if (this.state.endDate != null) {
            if (entries[i].createdAt < this.state.endDate) {
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
        <h3>Search by Created Date</h3>
        <div className="filter-dates">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            isClearable={true}
            dateFormat="DD MMMM YYYY"
            placeholderText="From:"
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
            placeholderText="To:"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => this.sortEntries("oldest")}>Sort by oldest</button>
        <button type="button" className="btn btn-primary" onClick={() => this.sortEntries()}>Sort by recent</button>
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
    if (entries.length > 0) {
      return entries.map(
        (e, i) =>
          <div key={i} className="card journal-card entry-card btn btn-success" id="testFun">
            <ul className="options" id="optionsNew">
              <li>{this.deleteButton(e)}</li>
              <li>{this.hideAndUnhideButton(e)}</li>
              <Link to={"/entry/history/" + e.entryId}>
                <li><button type="button" className="btn btn-link">History</button></li>
              </Link>
            </ul>
            <div className="entry-details">
              <Link to={'/editEntry/' + e.entryId} className="card-link">
                <div className="entry-title">
                  <h3>{e.title}</h3>
                  {e.state === "hidden" ? <h4 className="subtitle hidden">Hidden</h4> : ""}
                  {e.state === "deleted" ? <h4 className="subtitle deleted">Deleted</h4> : ""}
                </div>
                <div className="entry-date">
                  <p>Last updated: {moment(e.updatedAt).format("hh:mmA DD-MM-YYYY")}</p>
                </div>
              </Link>
            </div>
          </div>
      );
    } else {
      return (
        <div className="empty">
          <h3>No entries</h3>
        </div>
      )
    }
  }

  showSettings(event) {
    event.preventDefault();
  }

  close() {
    this.setState({
      showModal: false
    })
  }

  open() {
    this.setState({
      showModal: true
    })
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
        <div className="header">
          <h1> {this.state.title}</h1>

          <div className="toggle-buttons">
            <div className="hiddenToggle">
              <Toggle
                defaultChecked={this.state.showHidden}
                aria-labelledby='biscuit-label'
                onChange={this.handleHiddenChange.bind(this, "showHidden")}
              />
            </div>
            <p className="hiddenToggleText">Show Hidden</p>
            <div className="deletedToggle">
              <Toggle
                defaultChecked={this.state.eggsAreReady}
                aria-labelledby='biscuit-label'
                onChange={this.handleDeletedChange.bind(this, "showDeleted")}
              />
            </div>
            <p className="deletedToggleText">Show Deleted</p>
          </div>
        </div>

        <div className="cards">
          {this.renderEntries()}
        </div>
        {
          this.state.showModal &&
          <ModalContainer onClose={() => this.close()}>
            <ModalDialog style={{ height: '250px', width: '500px' }}>
              <div>
                <div className="new-journal-header">
                  <h>Delete {this.state.deleteSelected.title}?</h>
                </div>
                <br />
                <div className="new-journal-input">
                  <p>Are you sure you want to delete {this.state.deleteSelected.title}?</p>
                  <form onSubmit={this.handleSubmit}>
                    <button type="button" className="btn btn-secondary" onClick={() => this.close()}>Cancel</button>
                    <LoaderButton
                      type="submit"
                      isLoading={this.state.deleteLoading}
                      className="btn-danger"
                      text="Delete"
                      loadingText="Deleting..." />
                  </form>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div >
    );
  }
}