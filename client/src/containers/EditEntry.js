import React from 'react';
import { Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { invokeApig } from '../libs/awsLib';
import LoaderButton from "../components/LoaderButton";
import CKEditor from "react-ckeditor-component";
import Octoicon from "react-octicon";
import "./EditEntry.css";
import uuid from 'uuid';

export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.state = {
      isLoading: true,
      saveLoading: false,
      title: "",
      reason: "Created",
      content: '',
      current: JSON.parse(sessionStorage.current),
      entry: null,
      revision: null,
      existingEntry: false,
      error: false
    };
  }

  updateContent(newContent) {
    this.setState({
      content: newContent
    })
  }

  onChange = event => {
    var newContent = event.editor.getData();
    this.setState({
      content: newContent
    })
  }

  componentDidMount() {
    if (this.state.isLoading) {
      var entry = this.getEntry();
      var revision = this.getRevision();
      if (entry != null) {
        var reason = "";
        if (entry.state === "deleted") {
          reason = entry.revision[0].reason
        }
        this.setState({
          entry: entry,
          title: entry.title,
          reason: reason,
          content: entry.revision[0].content,
          existingEntry: true
        })
        this.props.updateChildProps({
          currentEntry: entry,
          currentJournal: this.state.current.journal,
          currentEntryRevision: null
        });
      } else {
        if (revision != null) {
          this.setState({
            entry: this.state.current.entry,
            title: this.state.current.entry.title,
            reason: revision.reason,
            content: revision.content,
            revision: revision,
            existingEntry: true
          })
        }
      }

      this.setState({ isLoading: false });
    }
  }

  getEntry() {
    if (this.state.current.journal != null) {
      var entries = this.state.current.journal.enteries;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].entryId === this.props.match.params.entryId) {
          return entries[i];
        }
      }
    }
    return null;
  }

  getRevision() {
    if (this.state.current.entry != null) {
      var revisions = this.state.current.entry.revision;
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
  validateForm() {
    var contentChanged = false;
    if (this.state.entry !== null) {
      contentChanged = this.state.entry.revision[0].content !== this.state.content;
    } else if (this.state.revision !== null) {
      contentChanged = this.state.revision.content !== this.state.content;
    } else {
      contentChanged = true;
    }
    return contentChanged && this.state.content.length > 0 && this.state.title.length > 0 && this.state.reason.length > 0
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      saveLoading: true
    })

    if (this.state.entry == null) {
      if (this.state.current.journal.enteries.findIndex(e => e.title === this.state.title) !== -1) {
        this.setState({
          error: true,
          saveLoading: false
        })
        return
      }
      this.state.current.journal.enteries.unshift({
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
      var pos = this.state.current.journal.enteries.findIndex(e => e.entryId === this.state.entry.entryId);
      this.state.current.journal.enteries[pos].updatedAt = moment().utc().format();
      this.state.current.journal.enteries[pos].revision.unshift({
        revisionId: uuid.v1(),
        reason: this.state.reason,
        content: this.state.content,
        modificationAt: moment().utc().format()
      })
    }

    try {
      const update = await this.updateJournal(this.state.current.journal);
    } catch (e) {
      this.setState({
        isLoading: false,
        saveLoading: false
      });
    }
    this.props.handleUpdate({ state: true });
    await this.props.sleep(250);
    this.props.history.push("/entry/" + this.state.current.journal.journalid);
  }

  handleCancel = event => {
    if (this.state.revision === null) {
      this.props.history.push("/entry/" + this.state.current.journal.journalid);
    } else {
      this.props.history.push("/entry/history/" + this.state.current.entry.entryId);
    }
  }

  updateJournal(journal) {
    return invokeApig({
      path: "/journal/" + journal.journalid,
      method: "PUT",
      body: { enteries: journal.enteries }
    })
  }

  renderTitleInput() {
    if (!this.state.error) {
      return (
        <div className="form-group" style={{color: this.props.theme.text}}>
          <h2><label htmlFor="title">Title</label></h2>
          <input type="text" className={"form-control "+this.props.theme.input} id="title" onChange={this.onTitleChange} value={this.state.title} placeholder="Enter Title:" disabled={this.state.existingEntry} />
        </div>
      )
    } else {
      return (
        <div className="form-group has-danger">
          <h2><label htmlFor="title">Title</label></h2>
          <input type="text" className={"form-control "+this.props.theme.input} id="title" onChange={this.onTitleChange} value={this.state.title} placeholder="Enter Title:" disabled={this.state.existingEntry} />
          <Tooltip placement="bottom" className="in" id="error">
            Sorry, that title is taken.
          </Tooltip>
        </div>
      )
    }
  }

  renderTitle() {
    return (
      <div className="form-group edit-title">
        <input type="text" className="form-control" value={this.state.title} disabled={true} style={{backgroundColor: this.props.theme.primary, color: this.props.theme.text}}/>
      </div>
    )
  }


  render() {
    return (
      <div style={{color: this.props.theme.text}}>
        {this.state.existingEntry ? this.renderTitle() : this.renderTitleInput()}
        {this.state.existingEntry ?
          <div className="form-group">
            <h2><label htmlFor="reason">Reason</label></h2>
            <input type="text" className={"form-control "+this.props.theme.input} id="reason" onChange={this.onReasonChange} value={this.state.reason} placeholder="Reason for change" disabled={this.state.revision !== null || (this.state.entry != null && this.state.entry.state === "deleted")} />
          </div> : ""}
        <h2>Content</h2>

        {this.state.revision !== null || (this.state.entry != null && this.state.entry.state === "deleted") ?
          <div>
            <div className="return btn-link" onClick={this.handleCancel}>
              <Octoicon mega name="arrow-left" />
              <p className="backFont">Return</p>
            </div>
            <div className={"read-only-content "+this.props.theme.shadow} style={{backgroundColor: this.props.theme.primary}} dangerouslySetInnerHTML={{__html: this.state.content}}>
            </div>
          </div>
          :
          <form onSubmit={this.handleSubmit}>
            <CKEditor
              activeClass={this.props.theme.editor}
              content={this.state.content}
              events={{
                "change": this.onChange
              }} />
            <div className="edit-buttons">
              <LoaderButton
                type="submit"
                isLoading={this.state.saveLoading}
                disabled={!this.validateForm()}
                className="btn-success"
                text="Save Entry"
                loadingText="Saving..." />
              <button type="button" className="btn btn-secondary" onClick={this.handleCancel}>Cancel</button>
            </div>
          </form>
        }


      </div>

    );
  }
}
