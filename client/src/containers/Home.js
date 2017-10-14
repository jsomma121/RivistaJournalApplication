import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap"
import LoaderButton from "../components/LoaderButton";
import { invokeApig } from '../libs/awsLib';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import moment from 'moment';
import PlusIcon from 'react-icons/lib/fa/plus';
import Ink from 'react-ink';
import MdArrowForward from 'react-icons/lib/md/arrow-forward';
import Modal from 'react-modal';
import config from "../config";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      createLoading: false,
      journalTitle: '',
      journal: [],
      error: false,
      isShowingModal: false,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return console.log('Is not logged in');
    }
    if (this.props.journal != null) {
      this.setState({ journal: this.props.journal })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ journal: nextProps.journal });
  }

  componentDidUpdate() {
    if (this.state.isLoading && this.props.journal.length > 0) {
      this.setState({
        journal: this.props.journal,
        isLoading: false
      });
    }
  }

  handleChange = event => {
    this.setState({
      journalTitle: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      createLoading: true
    })
    var journal = this.state.journal;
    const journalLength = journal.length;
    console.log(journalLength);
    for (var i = 0; i < journal.length; i++) {
      if (journal[i].journalTitle === this.state.journalTitle) {
        this.setState({
          error: true,
          createLoading: false
        })
        return;
      }
    }
    try {
      const data = await this.createJournal({
        journalTitle: this.state.journalTitle
      });
      this.setState({
        journalExists: false,
        isLoading: true
      });
    } catch (e) {
      this.setState({ isLoading: false });
    }
    
    await this.props.sleep(250);
    this.props.handleUpdate({ state: true });
    await this.props.sleep(250);

    // When a new item is added direct to the entry page
    if(journalLength < this.props.journal.length ) {
      this.props.history.push('/entry/' + this.props.journal[0].journalid);
    }
    
    
    this.setState({
      isLoading: true,
      isShowingModal: false,
      createLoading: false      
    })
  }

  handleClick = () => this.setState({ isShowingModal: true })
  handleClose = () =>
    this.setState({
      isShowingModal: false,
      error: false
    })

  createJournal(journal) {
    return invokeApig({
      path: "/journal",
      method: "POST",
      body: journal
    });
  }

  renderJournalList(journal) {
    if (journal.length > 0) {
      return journal.map(
        (j, i) =>
          <div key={i}>
            <Link to={'/entry/' + j.journalid} className="card-link">
              <div className={'card journal-card btn btn-success ' + this.props.theme.shadow} id="testFun" style={{backgroundColor: this.props.theme.primary, color: this.props.theme.text}}>
                <div className="journal-detail">
                  <div className="cardMiddle">
                    <h4 className="card-title journal-title">{j.journalTitle}</h4>
                  </div>
                  <div className="journal-create-date">
                    <p>Created: {moment(j.createdAt).format("hh:mmA DD-MM-YYYY")}</p>
                  </div>
                </div>
                <h className="card-arrow"><MdArrowForward /></h>
              </div>
            </Link>
          </div>
      )
    } else {
      return (
        <div className="empty">
          <h4>No journals, create one using the "New Journal" button</h4>
        </div>
      )
    }
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Welcome to Rivista</h1>
        <p>You currently have no journals. Click the button on the top right to create a Journal</p>
      </div>
    );
  }

  renderJournal() {
    console.log(this.props);
    return (
      <div className="Journal">
        <button onClick={this.handleClick} type="button" className="btn btn-success right new-journal-button"><Ink />New Journal <PlusIcon /><Ink /></button>
        <div className="header" style={{color: this.props.theme.text}}>
          <h1>Your Journals</h1>
        </div>
        <div className="journal-cards-div">
          {
            this.state.isShowingModal &&
            <ModalContainer onClose={this.handleClose}>
              <ModalDialog style={{ height: '250px', width: '500px', backgroundColor: this.props.theme.primary, color: this.props.theme.text }}>
                <div>
                  <div className="new-journal-header">
                    <h>Create new Journal</h>
                  </div>
                  <br />
                  <div className="new-journal-input">
                    <form onSubmit={this.handleSubmit}>
                      <h>Journal Name</h>
                      <div className="input-area">
                        <input type="text" className={"form-control "+this.props.theme.input} id="newJournalName" placeholder="Enter journal name" value={this.state.value} onChange={this.handleChange} />
                      </div>
                      <div className="new-journal-buttons">
                        {
                          this.state.error
                            ? <p>A journal already exists with that name</p>
                            : ""
                        }
                        <LoaderButton
                          type="submit"
                          isLoading={this.state.createLoading}
                          className="btn-primary"
                          text="Create Journal"
                          loadingText="Creating..." />
                        <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
                      </div>
                    </form>
                  </div>
                </div>
              </ModalDialog>
            </ModalContainer>
          }
        </div>
        <ListGroup>
          {!this.state.isLoading ? this.renderJournalList(this.state.journal) : this.renderJournalList([])}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderJournal() : this.renderLander()}
      </div>
    );
  }
}