import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import SkyLight from 'react-skylight';
import LoaderButton from "../components/LoaderButton";
import { withRouter } from 'react-router';
import "./JournalList.css";

export default class JournalList extends Component {
    constructor(props) {
        super(props);
        //just a testing journal list. should get datafrom database
        this.journalLists = [
            "Test journal title #1",
            "Test journal title #2",
            "Test journal title #3",
            "Test journal title #4",];
        this.state = {
            newJournalName: "",
            isLoading: false
        }

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleJournalOnlcick = () => {
        this.props.history.push('/entry');
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.journalLists.push(this.state.newJournalName);
        this.setState({ newJournalName: ""});
      }

    render() {

        //loop the exist journal (should from database)
        var jLs = this.journalLists;
        var jLsDisplay = [];
        for (var i = 0; i < jLs.length; i++) {
            jLsDisplay.push(
                <div key={i}>
                    <div id="jListCards" className="jListCards" onClick={this.handleJournalOnlcick}>
                        <p1>{jLs[i]}</p1>
                    </div><br />
                </div>
            );
        }

        var myBigGreenDialog = {
            backgroundColor: '#00897B',
            color: '#ffffff',
            width: '50%',
            height: '300px',
            marginLeft: '-25%',
        };

        return (
            <div className="JournalList">
                <div id="headText">
                    <h1>My Journals</h1><br />
                </div>
                <div id="existJournals">
                    {jLsDisplay}
                </div><br />
                <div id="createNewJornal" className="createNewJornal" onClick={() => this.customDialog.show()}>
                    <p2>Create new journal...</p2>
                </div>
                <div>
                    <SkyLight dialogStyles={myBigGreenDialog} hideOnOverlayClicked ref={ref => this.customDialog = ref} title="Create a NEW Journal">
                        <br />
                        <div id="submitNewJournal">
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup controlId="newJournalName" bsSize="large">
                                    <ControlLabel>Journal Name:</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        type="newJournalName"
                                        value={this.state.newJournalName}
                                        //the journal name should not match any exist journal from database
                                        //should have a valid function to check this
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <LoaderButton
                                    block
                                    bsSize="large"
                                    //disabled={!this.validateForm()}
                                    type="submit"
                                    isLoading={this.state.isLoading}
                                    text="Create!"
                                    loadingText="Creating…"
                                />
                            </form>
                        </div>
                    </SkyLight>
                </div>
            </div>
        );
    }

}