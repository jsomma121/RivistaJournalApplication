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
      isShowingModal: false,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return console.log('Is not logged in');
    }
<<<<<<< HEAD

    if (this.state.journal.length === 0) {
      try {
        const results = await this.journals();
        console.log(results);
        this.setState({ journal: results });
      } catch (e) {
        alert(e);
      }

      this.setState({ isLoading: false });
    }

  }

  async componentWillUpdate() {
    if (!this.props.isAuthenticated) {
      return console.log('Is not logged in');
    }

    if (this.state.journal.length === 0) {
      try {
        const results = await this.journals();
        console.log(results);
        this.setState({ journal: results });
      } catch (e) {
        alert(e);
      }

      this.setState({ isLoading: false });
    }

  }

  journals() {
    return invokeApig({ path: "/journal" });
  }

  renderJournalList(journal) {

    return journal.map(
      (j, i) =>
        <div key={i}>
          <Link to={'/entry/' + j.journalid} className="card-link">
            <div className='card journal-card btn btn-success' id="testFun">
              <div className="journalDetial">
                <div className="cardMiddle">
                  <h4 className="card-title journal-title">{j.journalTitle}</h4>
                </div>
                <div className="journalCreateDate">
                  <p>{new Date(j.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <h className="cardArrow"><MdArrowForward /></h>
            </div>
          </Link>
        </div>
    )
=======
    if (this.props.journal != null) {
      this.setState({ journal: this.props.journal })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ journal: nextProps.journal });
>>>>>>> master
  }

  handleChange = event => {
    this.setState({
      journalTitle: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
<<<<<<< HEAD
=======

>>>>>>> master
    this.setState({ isLoading: true });

    try {
      const data = await this.createJournal({
        journalTitle: this.state.journalTitle
      });
<<<<<<< HEAD
      //TO-DO - deal with the close modal problem
      this.handleClose();
      window.location.reload();
      return

=======
      console.log(this.props);
      this.props.handleUpdate();
      return
>>>>>>> master
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

<<<<<<< HEAD
  handleClick = () => this.setState({ isShowingModal: true })
  handleClose = () =>
    this.setState({
      isShowingModal: false,
      isLoading: false
    }
    )

=======
>>>>>>> master
  createJournal(journal) {
    return invokeApig({
      path: "/journal",
      method: "POST",
      body: journal
    });
  }

<<<<<<< HEAD
=======


>>>>>>> master
  handleJournalClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderJournalList(journal) {
    return journal.map(
      (j, i) =>
        <div>
          <Link key={i} to={'/entry/' + j.journalid} className="card-link">
            <div className='card journal-card'>
              <h4 className="card-title journal-title">{j.journalTitle}</h4>
              <p>{new Date(j.createdAt).toLocaleString()}</p>
            </div>
          </Link>

        </div>

    )
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  testApi() {
    invokeApig({
      path: "/journal/72c90700-a8df-11e7-b551-e3303e1fa777",
      method: "PUT",
      body: {enteries: [
        {
          title: "Test"
        },
        {
          title: "test2"
        }
      ]}
    });  
  }

  renderJournal() {
    return (
      <div className="Journal">
        <button onClick={this.handleClick} type="button" className="btn btn-success right" id="newJournalButton"><Ink />New Journal <PlusIcon /></button>
        <div className="pageHeader">
          <PageHeader>Your Journals</PageHeader>
        </div>
        <Ink />      
        <div className="journalCardsDiv">
          {
            this.state.isShowingModal &&
            <ModalContainer onClose={this.handleClose}>
              <ModalDialog style={{ height: '250px', width: '500px' }}>
                <div>
                  <div className="newJournalHeader">
                    <h>Create new Journal</h>
                  </div>
                  <br />
                  <div className="newJournalInput">
                    <form onSubmit={this.handleSubmit}>
                      <h>Journal Name</h>
                      <div className="inputArea">
                        <input type="text" className="form-control" id="newJournalName" placeholder="Enter journal name" value={this.state.value} onChange={this.handleChange} />
                      </div>
                      <div className="newJournalButtons">
                        <LoaderButton
                          type="submit"
                          isLoading={this.state.isLoading}
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
          {this.renderJournalList(this.props.journal)}
        </ListGroup>
<<<<<<< HEAD

        {/* old version of modal

=======
>>>>>>> master
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
                    <input type="text" className="form-control" id="newJournalName" placeholder="Enter journal name" value={this.state.value} onChange={this.handleChange} />
                  </div>
                  <LoaderButton
                    type="submit"
<<<<<<< HEAD
                    isLoading={this.state.isLoading}
                    className="btn-primary"
                    text="Create Journal"
                    loadingText="Creating..." />
                  <button type="button" className="btn btn-secondary" onClick={this.props.close} data-dismiss="modal">Cancel</button>
=======
                    isLoading={!this.state.isLoading}
                    className="btn-primary"
                    text="Create Journal"
                    loadingText="Creating..." />
                  <button type="button" className="btn btn-secondary" onClick={this.props.onRequestHide} data-dismiss="modal">Cancel</button>
>>>>>>> master
                </form>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD

        old version of modal */}

=======
>>>>>>> master
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