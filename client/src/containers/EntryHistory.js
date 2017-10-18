import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Octoicon from 'react-octicon';
import "./EntryHistory.css";
import moment from 'moment';

export default class EntryHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: JSON.parse(sessionStorage.current),
            entry: null,
            isLoading: true
        }
    }

    componentDidMount() {
        if (this.state.isLoading) {
            var entry = this.getEntry();
            if (entry != null) {
                this.setState({
                    entry: entry,
                    isLoading: false
                })
                this.props.updateChildProps({
                    currentEntry: entry,
                    currentJournal: this.state.current.journal,
                    currentEntryRevision: null
                });
            }
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

    renderRevision() {
        return this.state.entry.revision.map((r, i) =>
            <Link to={"/editEntry/" + r.revisionId} className="card-link">
                <div key={i} id="testFun" className={"card journal-card entry-card entryHistoryCards "+this.props.theme.shadow} style={{backgroundColor: this.props.theme.primary, color: this.props.theme.text}}>
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
                    <Link to={"/entry/" + this.state.current.journal.journalid} className="linkText">
                        <div className="return" style={{color: this.props.theme.text}}>
                            <p>Entry List</p>
                            <Octoicon mega name="arrow-left" />
                        </div>
                    </Link>

                    <div className="header" style={{color: this.props.theme.text}}>
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