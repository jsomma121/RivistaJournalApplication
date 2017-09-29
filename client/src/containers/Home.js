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
      const data = invokeApig({ path: "/journal" });
      return data;
    }
  

  renderJournalList(journal) {
    return [{}].concat(journal).map(
      (j, i) =>
        i !== 0
          ? <ListGroupItem
              key={j.journalid}
              href={`/journal/${j.journalid}`}
              onClick={this.handleJournalClick}
              // header={j.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(j.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/journal/new"
              onClick={this.handleJournalClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new note
              </h4>
            </ListGroupItem>
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
<<<<<<< HEAD
        {this.props.isAuthenticated ? this.renderJournal() : this.renderLander()}
=======
        <div className="lander">
          <h1>Rivista</h1>
          <p>The professional journal application</p>
          <Link to="/login">
            <div className="goButton">
              <p1>Click me!</p1>
            </div>
          </Link>
        </div>
>>>>>>> ba7407a278e143cce29b1b3c39f57b84bafaf012
      </div>
    );
  }
}