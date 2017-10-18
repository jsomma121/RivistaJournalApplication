import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import Toggle from 'react-toggle'
import Octoicon from 'react-octicon';
import { invokeApig } from '../libs/awsLib';
import { ModalContainer, ModalDialog } from "react-modal-dialog";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PlusIcon from 'react-icons/lib/fa/plus';
import 'react-datepicker/dist/react-datepicker.css';
import "./Entry.css";
import "react-toggle/style.css"

export default class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      deleteLoading: false,
      deleteSelected: "",
      searchText: "",
      startDate: null,
      endDate: null,
      showHidden: false,
      showDeleted: false,
      showActive: true,
      showAll: false,
      showModified: false,
      showFilter: false,
      showModal: false,
      currentJournal: null
    }
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

  }

  getJournal() {
    var journals = this.props.journal;
    for (var i = 0; i < journals.length; i++) {
      if (journals[i].journalid === this.props.match.params.journalId) {
        journals[i].enteries.sort((a, b) => {
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
    await this.props.sleep(150);
    this.props.handleUpdate({ state: true });
    await this.props.sleep(150);
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

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    if (this.state.isLoading && !this.props.isLoading) {
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

  validateForm() {
    return this.state.EntryName.length > 0;
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleFilter();
    }
  }

  handleSearchChange = event => {
    this.setState({
      searchText: event.target.value
    })
  }

  handleChangeStart(date) {
    var endDate = date;
    if (endDate != null) {
      endDate = moment(date).add(23, "h").add(59, "m");
    }
    if (this.state.endDate != null) {
      endDate = this.state.endDate;
    }
    this.setState({
      startDate: date,
      endDate: endDate
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
      if (entries[i].entryId === this.state.deleteSelected.entryId) {
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
      if (entries[i].entryId === data) {
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
        entries[i].state = 'hidden';
        this.forceUpdate();
        break;
      }
    }
    this.update();
  }

  hideAndUnhideButton(entry) {
    if (entry.state === 'hidden') {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleActive(entry.entryId) }} disabled={entry.state === "deleted"}>Unhide</button>
      )
    } else {
      return (
        <button type="button" className="btn btn-link" onClick={() => { this.handleHide(entry.entryId) }} disabled={entry.state === "deleted"}>Hide</button>
      )
    }
  }

  handleActiveChange() {
    this.setState({
      showActive: !this.state.showActive,
      showAll: false,
      showHidden: false,
      showDeleted: false,
      showModified: false
    })
  }

  handleHiddenChange() {
    this.setState({
      showHidden: !this.state.showHidden,
      showAll: false,
      showActive: false,
      showDeleted: false,
      showModified: false
    })
  }

  handleAllChange() {
    this.setState({
      showAll: !this.state.showAll,
      showActive: false,
      showDeleted: false,
      showHidden: false,
      showModified: false
    })
  }

  handleModifiedChange() {
    this.setState({
      showModified: !this.state.showModified,
      showActive: false,
      showDeleted: false,
      showHidden: false,
      showAll: false
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
      showDeleted: !this.state.showDeleted,
      showActive: false,
      showModified: false,
      showHidden: false,
      showAll: false
    })
  }

  handleDelete(data) {
    this.setState({
      deleteSelected: data,
      showModal: true
    })
  }

  filter(entry) {
    /*if (!this.state.showHidden && !this.state.showDeleted) {
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
    return null;*/
    if (this.state.showAll) {
      return entry;
    }

    if (this.state.showActive && entry.state === "active" && entry.revision.length === 1) {
      return entry;
    }

    if (this.state.showHidden && entry.state === "hidden") {
      return entry;
    }

    if (this.state.showDeleted && entry.state === "deleted") {
      return entry;
    }

    if (this.state.showModified && entry.revision.length > 1) {
      return entry;
    }

    return null;
  }

  handleNewEntry() {
    this.props.history.push('/editEntry/new');
  }

  sortEntries(by) {
    if (by === "abc") {
      this.state.currentJournal.enteries.sort((a, b) => {
        var aTitle = a.title.toLowerCase();
        var bTitle = b.title.toLowerCase();
        if (aTitle < bTitle) {
          return -1;
        }
        if (aTitle > bTitle) {
          return 1;
        }
        return 0;
      })
    } else if (by === "newest") {
      this.state.currentJournal.enteries.sort((a, b) => {
        return moment(b.updatedAt) - moment(a.updatedAt)
      })
    } else {
      this.state.currentJournal.enteries.sort((a, b) => {
        return moment(a.updatedAt) - moment(b.updatedAt)
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
        var entry = this.filter(entries[i]);
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
      var entry = this.filter(entries[i]);
      if (entry != null) {
        if (entries[i].title.includes(this.state.searchText) || entries[i].revision[0].content.includes(this.state.searchText)) {
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
      <div className={"filter " + this.props.theme.shadow} style={{ backgroundColor: this.props.theme.primary }} ref={this.setWrapperRef}>
        <h3>Search by Created Date</h3>
        <div className="filter-dates">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            className={this.props.theme.input}
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
            className={this.props.theme.input}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            isClearable={true}
            dateFormat="DD MMMM YYYY"
            placeholderText="To:"
          />
        </div>
        <div className="toggle-buttons">
          <button type="button" className="btn btn-primary" onClick={() => this.sortEntries("abc")}>Sort alphabetically</button>
          <button type="button" className="btn btn-primary" onClick={() => this.sortEntries("newest")}>Sort by newest</button>
          <button type="button" className="btn btn-primary" onClick={() => this.sortEntries()}>Sort by oldest</button>
        </div>
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
          <div key={i} className={"card journal-card entry-card btn btn-success " + this.props.theme.shadow} id="testFun" style={{ backgroundColor: this.props.theme.primary }}>
            <ul className="options" id="optionsNew">
              <li>{this.deleteButton(e)}</li>
              <li>{this.hideAndUnhideButton(e)}</li>
              <Link to={"/entry/history/" + e.entryId}>
                <li><button type="button" className="btn btn-link">History</button></li>
              </Link>
            </ul>
            <div className="entry-details">
              <Link to={'/editEntry/' + e.entryId} className="card-link">
                <div className="entry-title" style={{ color: this.props.theme.text }}>
                  <h3>{e.title}</h3>
                  {e.state === "hidden" ? <h4 className="subtitle hidden">Hidden</h4> : ""}
                  {e.state === "deleted" ? <h4 className="subtitle deleted">Deleted</h4> : ""}
                </div>
                <div className="entry-date" style={{ color: this.props.theme.text }}>
                  <p>{e.state === "deleted" || e.revision.length === 1 ? "Date created:" : "Last updated:"} {moment(e.updatedAt).format("hh:mmA DD-MM-YYYY")}</p>
                </div>
              </Link>
            </div>
          </div>
      );
    } else {
      return (
        <div className="empty" style={{ color: this.props.theme.text }}>
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
    return (
      <div>
        <button type="button" className="btn btn-success new-journal-button" onClick={() => this.handleNewEntry()}>New entry <PlusIcon /></button>
        <div id="search" className="input-group" style={{ color: this.props.theme.text }}>
          <input className={"" + this.props.theme.input} type="text" placeholder="Search..." onChange={this.handleSearchChange} value={this.state.searchText} />
          <Octoicon className="search-icon" name="search" />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="button" onClick={e => this.toggleFilter(e)}><Octoicon name="settings" /></button>
          </span>
          {this.state.showFilter ? this.renderFilter() : ""}
        </div>

        <Link to="/" className="linkText">
          <div className="return" style={{ color: this.props.theme.text }}>
            <p className="backFont">Back to Journals</p>
            <Octoicon mega name="arrow-left" />
          </div>
        </Link>
        <div className="header" style={{ color: this.props.theme.text }}>
          <h1> {this.state.title}</h1>

          <div className="toggle-buttons" style={{ color: this.props.theme.text }}>
            <div className="toggle">
              <div>
                <Toggle
                  checked={this.state.showActive}
                  aria-labelledby='biscuit-label'
                  onChange={this.handleActiveChange.bind(this, "showActive")}
                />
              </div>
              <p>Show Active</p>
            </div>
            <div className="toggle">
              <div>
                <Toggle
                  checked={this.state.showAll}
                  aria-labelledby='biscuit-label'
                  onChange={this.handleAllChange.bind(this, "showAll")}
                />
              </div>
              <p>Show All</p>
            </div>
            <div className="toggle">
              <div>
                <Toggle
                  checked={this.state.showHidden}
                  aria-labelledby='biscuit-label'
                  onChange={this.handleHiddenChange.bind(this, "showHidden")}
                />
              </div>
              <p>Show Hidden</p>
            </div>
            <div className="toggle">
              <div>
                <Toggle
                  aria-labelledby='biscuit-label'
                  onChange={this.handleDeletedChange.bind(this, "showDeleted")}
                  checked={this.state.showDeleted}
                />
              </div>
              <p>Show Deleted</p>
            </div>
            <div className="toggle">
              <div>
                <Toggle
                  aria-labelledby='biscuit-label'
                  onChange={this.handleModifiedChange.bind(this, "showModified")}
                  checked={this.state.showModified}
                />
              </div>
              <p>Show Modified</p>
            </div>
          </div>
        </div>
        <div className="no-shadow" style={{ width: "auto", height: "2px", backgroundColor: this.props.theme.text }}>
        </div>
        <div className="cards">
          {this.renderEntries()}
        </div>
        {
          this.state.showModal &&
          <ModalContainer onClose={() => this.close()}>
            <ModalDialog style={{ height: '250px', width: '500px', backgroundColor: this.props.theme.primary, color: this.props.theme.text }}>
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