import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap"
import LoaderButton from "../components/LoaderButton";
import { invokeApig } from '../libs/awsLib';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
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
      journalTitle: '',
      journalId: '99292f88-f840-4f8c-bdb4-4ae7d8c0309a',
      journal: [],
      journalExists: null,
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

  handleChange = event => {
    this.setState({
      journalTitle: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    var journal = this.state.journal;
    var journalExists = null;

    for(var i = 0; i < journal.length; i++){
      if(journal[i].journalTitle === this.state.journalTitle){
        journalExists = true;
        break;
      } else {
        journalExists = false;       
      }
    }

    if(!journalExists) {
      
      try {
        const data = await this.createJournal({
          journalTitle: this.state.journalTitle
        }); 
        this.setState({
          journalExists: false,
          isShowingModal: false,
        });
        
      } catch (e) {
        this.setState({ isLoading: false });
      }
    } else {
      this.setState({
        journalExists: true,
        isShowingModal: true,
      });
    }
    
    
    
  }

  handleClick = () => this.setState({ isShowingModal: true })
  handleClose = () =>
    this.setState({
      isShowingModal: false,
      journalExists: false,
    }
    )

  createJournal(journal) {
    return invokeApig({
      path: "/journal",
      method: "POST",
      body: journal
    });
  }

  renderJournalList(journal) {
    return journal.map(
      (j, i) =>
        <div key={i}>
          <Link to={'/entry/' + j.journalid} className="card-link">
            <div className='card journal-card btn btn-success' id="testFun">
              <div className="journal-detail">
                <div className="cardMiddle">
                  <h4 className="card-title journal-title">{j.journalTitle}</h4>
                </div>
                <div className="journal-create-date">
                  <p>{new Date(j.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <h className="card-arrow"><MdArrowForward /></h>
            </div>
          </Link>
        </div>
    )
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
    return (
      <div className="Journal">
        <button onClick={this.handleClick} type="button" className="btn btn-success right" id="new-journal-button"><Ink />New Journal <PlusIcon /><Ink /></button>
        <div className="header">
          <h1>Your Journals</h1>
        </div>
        <div className="journal-cards-div">
          {
            this.state.isShowingModal &&
            <ModalContainer onClose={this.handleClose}>
              <ModalDialog style={{ height: '250px', width: '500px' }}>
                <div>
                  <div className="new-journal-header">
                    <h>Create new Journal</h>
                  </div>
                  <br />
                  <div className="new-journal-input">
                    <form onSubmit={this.handleSubmit}>
                      <h>Journal Name</h>
                      <div className="input-area">
                        <input type="text" className="form-control" id="newJournalName" placeholder="Enter journal name" value={this.state.value} onChange={this.handleChange} />
                      </div>
                      <div className="new-journal-buttons">
                        {
                          this.state.journalExists
                            ? <p>A journal already exists with that name</p>
                            : null
                        }
                        <LoaderButton
                          type="submit"
                          isLoading={!this.state.isLoading}
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
          {this.state.isLoading && this.renderJournalList(this.state.journal)}
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