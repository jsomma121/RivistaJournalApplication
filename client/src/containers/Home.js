import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap"
import LoaderButton from "../components/LoaderButton";
import { invokeApig } from '../libs/awsLib';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
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
      showModal: false,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
        return console.log('Is not logged in');
	}
	if(this.props.journal != null) {
		this.setState({journal: this.props.journal})
	}
  }

  componentWillReceiveProps(nextProps) {
		this.setState({journal: nextProps.journal});
		this.setState({isLoading: nextProps.isLoading});
  } 

  handleChange = event => {
    this.setState({
        journalTitle: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      const data = await this.createJournal({
        journalTitle: this.state.journalTitle
	  });
	  
      this.props.onRequestHide();
      return 
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }
  
  createJournal(journal) {
    return invokeApig({
      path: "/journal",
      method: "POST",
      body: journal
    });
  }

 
  
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

  renderJournal() {
    return (
      <div className="Journal">
        <PageHeader>Your Journals</PageHeader>
		<ListGroup>
          {this.renderJournalList(this.props.journal)}
		</ListGroup>
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
						<LoaderButton
							type="submit"
							isLoading={this.state.isLoading}
							className="btn-primary"
							text="Create Journal"
							loadingText="Creating..."/>
							<button type="button" className="btn btn-secondary"  onClick={this.props.onRequestHide} data-dismiss="modal">Cancel</button>
					</form>
				</div>
			</div>
		</div>
		</div>
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