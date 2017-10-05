import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import LeftArrowIcon from 'react-icons/lib/fa/arrow-left';
import RightArrowIcon from 'react-icons/lib/fa/angle-right';
import SkyLight from 'react-skylight';
import Octoicon from 'react-octicon';
import "./Entry.css";

export default class Entry extends Component {
  constructor(props) {
    super(props);
    //just a test entry list
    this.entryLists = [
      "Test entry title 1",
      "Test entry title 2",
      "Test entry title 3",
      "Test entry title 4",
      "Test entry title 5",
      "Test entry title 6",
      "Test entry title 7"];

    this.pathName = this.props.location.pathname;
	this.journalTitle = this.pathName.substring(this.pathName.indexOf("{") + 1, this.pathName.indexOf("}"));
	console.log(this.props.journal);
	if (this.props.journal.length > 0) {
		var journal = this.getJournal();
		console.log(journal);
		this.props.updateChildProps({
			currentEntry: null,
			currentJournal: journal,
			currentEntryRevision: null
		});
		console.log(this.props.journal);
	}
	
    this.state = {
      EntryName: "",
      isLoading: true,
      deleteSelected: "",
      searchText: "",
      startDate: "",
      endDate: "",
      showHidden: false,
      showDeleted: false,
      entries: [],
      filteredEntries: [],
    }
  }

  getJournal(){
	var journal = this.props.journal;
	for (var i = 0; i < journal.length; i++ ) {
		if(journal[i].journalid === this.props.match.params.journalId) {
			return journal[i];
		}
	
	}

	return null;

  }

  handleSelete(select) {
    this.setState({
      deleteSelected: select
    });
  }

  componentWillReceiveProps(nextProps) {
	if(this.state.isLoading){
		var journal = this.getJournal();
		this.props.updateChildProps({
			currentEntry: null,
			currentJournal: journal,
			currentEntryRevision: null
		});
		this.setState({isLoading: false});
	}
	
}

  handleDelete(data) {
    for (var i = 0; i < this.entryLists.length; i++) {
      if (this.entryLists[i] == data) {
        this.entryLists.splice(i, 1);
        break;
      }
    }
  }

  validateForm() {
    return this.state.EntryName.length > 0;
  }

  handleChange = event => {
    this.setState({
      EntryName: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    
    try {
      const data = await this.createJournalEntry({
        journalTitle: this.state.journalTitle
      });
      //TO-DO - deal with the close modal problem
      this.props.onRequestHide();
      return 
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  handleSearchChange = event => {
    this.setState({
      searchText: event.target.value
    })
    this.filterEntries();
  }

  filterEntries() {

  }

  render() {

    var pageTitle = this.journalTitle + " Entries";

    var data = this.entryLists;
    var cards = [];
    for (var i = 0; i < data.length; i++) {
      var pathName = "/editEntry/${" + data[i] + "}";
      cards.push(
        <div key={i} className="entryCards">
          <div className="leftOptions">
            <div className="optionsTable">
              <div className="deleteOption">
                <p onClick={() => this.untitled.show()}>Delete</p>
              </div>
              <div className="hiddenOption">
                <p>Hide</p>
              </div>
              <div className="historyOption">
                <p>History</p>
              </div>
            </div>
          </div>

          <div className="entryDetails">
            <Link to={pathName} key={i + data.length} className="entryLink">
              <div className="entryTitle">
                <h3>{data[i]}</h3>
              </div>
              <div className="entrySubtitle">
                <p>Last Updated: 8.40pm 27-09-2017</p>
              </div>
            </Link>
          </div>

        </div>
      )
    }

    return (
      <div>
        <div id="search">
          <input type="text" placeholder="Search..." onChange={this.handleSearchChange} value={this.state.searchText} />
          <Octoicon name="search" />
        </div>
        <Link to="/" className="linkText">
          <div className="return"> 
            <p>Back to Journals</p>
            <Octoicon mega name="mail-reply"/>
          </div>
        </Link>
        <div className="header">
          <div className="headerText">
            <p>{pageTitle}</p>
          </div>
        </div>

        <div className="cards">
          {cards}
        </div>

        <div className="popDelete">
          <SkyLight hideOnOverlayClicked ref={ref => this.untitled = ref}>
            <p>{this.state.deleteSelected}</p>
          </SkyLight>
        </div>

      </div>
    );
  }
}
