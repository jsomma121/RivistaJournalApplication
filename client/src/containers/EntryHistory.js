import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Octoicon from 'react-octicon';
import "./EntryHistory.css";
import moment from 'moment';

export default class EntryHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            journal: null,
            entry: null,
            isLoading: true
        }
    }

    componentDidMount() {
        if (this.state.isLoading) {
            var entry = this.getEntry();
            if (entry != null) {
                this.setState({
                    journal: this.props.currentJournal,
                    entry: entry,
                    isLoading: false
                })
                this.props.updateChildProps({
                    currentEntry: entry,
                    currentJournal: this.props.currentJournal,
                    currentEntryRevision: null
                });
            }
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
        }
        return null;
    }

    renderRevision() {
        return this.state.entry.revision.map((r, i) =>
            <Link to={"/editEntry/" + r.revisionId} className="card-link">
                <div key={i} className="entryHistoryCards">
                    <div className="entryHistoryDetail">
                        <h className="editTime">{moment(r.modificationAt).format("hh:mmA DD-MM-YYYY")}</h>
                        <p className="editReason">{r.reason}</p>
                    </div>
                </div>
            </Link>
        )
    }
    render() {
        if (this.state.entry != null) {
            return (
                <div>
                    <Link to={"/entry/" + this.props.currentJournal.journalId} className="linkText">
                        <div className="return">
                            <p>Back to Entry List</p>
                            <Octoicon mega name="arrow-left" />
                        </div>
                    </Link>

                    <div className="header">
                        <h1>{this.state.entry.title} History</h1>
                    </div>

                    <br />
                    <div className="historyCards">
                        {this.renderRevision()}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    Loading...
                </div>
            )
        }
    }
}