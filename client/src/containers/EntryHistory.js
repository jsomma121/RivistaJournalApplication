import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Octoicon from 'react-octicon';
import "./EntryHistory.css";

export default class EntryHistory extends Component {
    constructor(props) {
        super(props);
        //just a test entry list
        this.entryHistoryLists = [
            "History 1",
            "History 2",
            "History 3",
            "History 4",
            "History 5",
            "History 6",
            "History 7"];

        this.pathName = this.props.location.pathname;
        this.historyOfEntry = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}")) + " History";

        this.state = {

        }
    }


    render() {
        var data = this.entryHistoryLists;
        var cards = [];
        for (var i = 0; i < data.length; i++) {
            var pathName = "/entry/history/${" + data[i] + "}";
            cards.push(
                <div key={i} className="entryHistoryCards">
                    <div className="entryHistoryDetail">
                        <h className="editTime">10:42pm 24/04/2017</h>
                        <p className="editReason">Reason: some reasons</p>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <div className="header">
                    <h>{this.historyOfEntry}</h>
                </div>
                <Link to="/entry/" className="linkText">
                    <div className="return">
                        <p>Back to Entry List</p>
                        <Octoicon mega name="mail-reply" />
                    </div>
                </Link>
                <br />
                <div className="historyCards">
                    {cards}
                </div>
            </div>
        );
    }
}