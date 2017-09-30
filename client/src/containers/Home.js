import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap"
import { invokeApig } from '../libs/awsLib';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      journal: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
        return console.log('Is not logged in');
    }

    if(this.state.journal.length === 0){
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

      if(this.state.journal.length === 0){
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
        <Link key={i} to={'/entry/' + j.journalid} className="card-link">
          <div className='card journal-card'>
            <h4 className="card-title journal-title">{j.journalTitle}</h4>
            <p>{new Date(j.createdAt).toLocaleString()}</p>
          </div>
        </Link>
    );
  }
  
  handleJournalClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
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
          {!this.state.isLoading && this.renderJournalList(this.state.journal)}
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