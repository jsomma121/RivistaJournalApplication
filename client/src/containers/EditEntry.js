import React from 'react';
import { Link } from 'react-dom';
import Octoicon from 'react-octicon';
import { Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { invokeApig } from '../libs/awsLib';
import LoaderButton from "../components/LoaderButton";
import "./EditEntry.css";
import uuid from 'uuid';

export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      title: "",
      reason: "Created",
      content: '',
      entry: null,
      revision: null,
      existingEntry: false,
      error: false
    };
  }

  componentDidMount() {
    console.log(this.props.currentJournal);
    if (this.state.isLoading) {
      var entry = this.getEntry();
      var revision = this.getRevision();
      console.log(entry);
      if (entry != null) {
        if (revision == null) {
          this.setState({
            entry: entry,
            title: entry.title,
            reason: "",
            content: entry.revision[0].content,
            existingEntry: true
          })
          this.props.updateChildProps({
            currentEntry: entry,
            currentJournal: this.props.currentJournal,
            currentEntryRevision: null
          });
        } else {
          this.setState({
            entry: entry,
            title: revision.title,
            reason: "",
            content: revision.content,
            existingEntry: true
          })
        }
      }

      this.setState({ isLoading: false });
    }
  }

  getEntry() {
    if (this.props.currentJournal != null) {
      var entries = this.props.currentJournal.enteries;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].entryId === this.props.match.params.entryId) {
          return entries[i];
        }
      }
      return null;
    }
    return null;
  }

  getRevision() {
    if (this.state.entry != null) {
      var revisions = this.state.entry.revision;
      for (var i = 0; i < revisions.length; i++) {
        if (revisions[i].revisionId === this.props.match.params.entryId) {
          return revisions[i];
        }
      }
      return null;
    }
    return null;
  }

  onTitleChange = event => {
    this.setState({
      title: event.target.value
    })
  }

  onReasonChange = event => {
    this.setState({
      reason: event.target.value
    })
  }

  onChange = event => {
    this.setState({
      content: event.target.value
    })
  }

  validateForm() {
    return this.state.content.length > 0 && this.state.title.length > 0 && this.state.reason.length > 0
  }

  handleSubmit = async event => {
    event.preventDefault();
    
    if (this.state.entry == null) {
      if (this.props.currentJournal.enteries.findIndex(e => e.title === this.state.title) != -1) {
        this.setState({
          error: true
        })
        return
      }
      this.props.currentJournal.enteries.push({
        entryId: uuid.v1(),
        title: this.state.title,
        state: 'active',
        createdAt: moment().utc().format(),
        updatedAt: moment().utc().format(),
        revision: [{
          revisionId: uuid.v1(),
          reason: this.state.reason,
          content: this.state.content,
          modificationAt: moment().utc().format()
        }]
      });
    } else {
      var pos = this.props.currentJournal.enteries.findIndex(e => e.entryId === this.state.entry.entryId);
      this.props.currentJournal.enteries[pos].updatedAt = moment().utc().format();
      this.props.currentJournal.enteries[pos].revision.unshift({
        revisionId: uuid.v1(),
        reason: this.state.reason,
        content: this.state.content,
        modificationAt: moment().utc().format()
      })
    }

    try {
      const update = await this.updateJournal(this.props.currentJournal);
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  handleCancel = event => {
    if (this.state.revision === null) {
      this.props.history.push("/entry/" + this.props.match.params.entryId);
    } else {
      this.props.history.push("/history/" + this.props.match.params.entryId);
    }
  }

  updateJournal(journal) {
    invokeApig({
      path: "/journal/" + journal.journalid,
      method: "PUT",
      body: { enteries: journal.enteries }
    })
  }

  renderTitleInput() {
    if (!this.state.error) {
      return (
        <div className="form-group edit-title">
          <input type="text" className="form-control" id="title" onChange={this.onTitleChange} value={this.state.title} placeholder="Title" disabled={this.state.existingEntry} />
        </div>
      )
    } else {
      return (
        <div className="form-group has-danger edit-title">
          <input type="text" className="form-control" id="title" onChange={this.onTitleChange} value={this.state.title} placeholder="Title" disabled={this.state.existingEntry} />
          <Tooltip placement="bottom" className="in" id="error">
            Sorry, that title is taken.
          </Tooltip>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderTitleInput()}
        <div className="form-group">
          <h2><label htmlFor="reason">Reason</label></h2>
          <input type="text" className="form-control" id="reason" onChange={this.onReasonChange} value={this.state.reason} placeholder="Reason for change" disabled={this.state.revision !== null} />
        </div>
        <h2>Content</h2>
        <form onSubmit={this.handleSubmit}>
          <textarea type="text" className="edit-input" onChange={this.onChange} value={this.state.content} disabled={this.state.revision !== null} />
          <div className="edit-buttons">
            <LoaderButton
              type="submit"
              isLoading={this.state.isLoading}
              disabled={!this.validateForm()}
              className="btn-success"
              text="Save Entry"
              loadingText="Creating..." />
            <button type="button" className="btn btn-secondary" onClick={this.handleCancel}>Cancel</button>
          </div>
        </form>
      </div>

    );
  }
}