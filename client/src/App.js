import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Nav, Navbar, NavItem } from "react-bootstrap";
// import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import SignOutIcon from 'react-icons/lib/fa/sign-out';
import PlusIcon from 'react-icons/lib/fa/plus';
import { invokeApig, authUser, signOutUser } from "./libs/awsLib";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
	  isAuthenticating: false,
	  isLoading: true,
	  currentJournal: null,
	currentEntry: null,
		currentEntryRevision: null,
		journal: []
    };

    this.searchBar;
  }


  getMenu(route) {
    var menu = [];
    var pathName = route;
    if (pathName.includes("/entry")) {
      pathName = "/entry";
    }
    switch (pathName) {
      case '/login':
      case '/register':
      case '/history':
        break;
      case '/':
        menu.push(
          <div key="1" className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-success right" data-toggle="modal" data-target="#newJournalModal">New Journal <PlusIcon/></button>
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon/></button>
          </div>
        )
        break;
        case '/entry':
        menu.push(
          <div key="2"className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-success right" data-toggle="modal" onClick={this.handleNewEntryCick}>New Entry <PlusIcon/></button>
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon/></button>
          </div>
        )
        break;
        case '/editEntry/:entryName':
        menu.push(
          <div key="3"className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon/></button>
          </div>
        )
        break;
        default:
    }
    return menu;
  }
  
  handleNewEntryCick = event => {
    event.preventDefault();
    this.props.history.push('/editEntry/new');
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
		this.userHasAuthenticated(true);
		this.getJournals();
      }
    }
    catch (e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  async getJournals() {
	if(this.state.isLoading){
	  try {
		  const getData = await invokeApig({ path: "/journal" });
		  
		  this.setState({ journal: getData });
	  } catch (e) {
		  alert(e);
	  }
	  this.setState({ isLoading: false });
	}
  }

	updateChildProps = current => {
	  this.setState({
		  currentEntry: current.currentEntry,
		  currentJournal: current.currentJournal,
		  currentEntryRevision: current.currentEntryRevision
	  })
  }
 
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
	  userHasAuthenticated: this.userHasAuthenticated,
	  isLoading: this.state.isLoading,
	  journal: this.state.journal,
	  updateChildProps: this.updateChildProps,
	  currentJournal: this.state.currentJournal,
	  currentEntry: this.state.currentEntry,
	  currentEntryRevision: this.state.currentEntryRevision

    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <nav className="navbar fixed-top">
          <Link to="/" className="navbar-brand">Rivista</Link>
          {this.getMenu(this.props.location.pathname)}
        </nav>
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withRouter(App);
