import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { withRouter } from 'react-router';
import "./Journal.css";

export default class JournalList extends Component {
    constructor(props) {
        super(props);
        //just a testing journal list.
        this.journalLists = ["Test journal title 1",
            "Test journal title 2",
            "Test journal title 3",
            "Test journal title 4",
            "Test journal title 5",
            "Test journal title 6"];
        this.state = {
            JournalName: "",
            isLoading: false
        }
    }

    validateForm() {
        return this.state.JournalName.length > 0;
    }

    // handleJournalOnClick() {
    //     this.props.router.push({ state: {testData: 'asd'}});
    // }

    handleChange = event => {
        this.setState({
            JournalName: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.journalLists.push(this.state.JournalName);
        this.setState({ JournalName: "" });
    }

    render() {

        //loop the exist journal (should from database)
        var data = this.journalLists;
        var cards = [];
        for (var i = 0; i < data.length; i++) {
            cards.push(
                <Link key={i} to="/entry" className="card-link">
                    <div className="card journal-card">
                        <h4 className="card-title journal-title">{data[i]}</h4>
                    </div>
                </Link>
            )
        }

        return (
            <div>
                <h1 className="header">My Journals</h1>
                <div className="cards">
                    {cards}
                </div>
                <div className="modal fade" id="newJournalModal" role="dialog" aria-labelledby="newJournalModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="newJournalModalLabel">Create a Journal</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="newJournalName">Name</label>
                                        <input type="text" className="form-control" id="newJournalName" placeholder="Enter journal name" value={this.state.value} onChange={this.handleChange}/>
                                    </div>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <LoaderButton
                                        type="submit"
                                        isLoading={this.state.isLoading}
                                        disabled={!this.validateForm()}
                                        className="btn-primary"
                                        text="Create Journal"
                                        loadingText="Creating..."/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}