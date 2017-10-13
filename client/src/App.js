import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Nav, Navbar, NavItem } from "react-bootstrap";
// import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import SignOutIcon from 'react-icons/lib/fa/sign-out';
import PlusIcon from 'react-icons/lib/fa/plus';
import newJournalClicked from './containers/Home';
import moment from 'moment';
import { invokeApig, authUser, signOutUser } from "./libs/awsLib";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
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

    if (pathName.includes("/entry/history")) {
      pathName = "/entry/history";
    }
    switch (pathName) {
      case '/login':
        menu.splice(0, menu.length);
        break;
      case '/register':
      case '/entry/history':
        menu.splice(0, menu.length);
        menu.push(
          <div key="1" className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon /></button>
          </div>
        )
        break;
        case '/':
        menu.splice(0, menu.length);
        menu.push(
          <div key="2" className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon /></button>
          </div>
        )
        break;
      case '/entry':
        menu.splice(0, menu.length);
        menu.push(
          <div key="3" className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-success right" data-toggle="modal" onClick={this.handleNewEntryCick}>New Entry <PlusIcon /></button>
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon /></button>
          </div>
        )
        break;
      case '/editEntry/:entryName':
        menu.splice(0, menu.length);
        menu.push(
          <div key="4" className="navbar-toggler navbar-toggler-right">
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon /></button>
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
      } else {
        if (!this.props.location.pathname.includes("/login")) {
          console.log("test");
          this.props.history.push("/login");
        }
      }
    }
    catch (e) {
      console.log(e);
    }

    this.setState({ isAuthenticating: false });
  }

  async componentDidUpdate() {
    try {
      if (this.state.isLoading) {
        if (await authUser()) {
          this.getJournals();
        } else {
          if (!(this.props.location.pathname.includes("/login") || this.props.location.pathname.includes("/signup"))) {
            console.log("test");
            this.props.history.push("/login");
          }
        }        
      }
    } catch (e) {
      console.log(e)
    }
  }

  handleUpdate = state => {
    this.setState({ isLoading: state.state });
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
    try {
      const getData = await invokeApig({ path: "/journal" });
      getData.sort((a,b)=> {
        return moment(b.createdAt) - moment(a.createdAt);
      })
      this.setState({ journal: getData });
    } catch (e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  updateChildProps = current => {
    this.setState({
      currentEntry: current.currentEntry,
      currentJournal: current.currentJournal,
      currentEntryRevision: current.currentEntryRevision
    });
    sessionStorage.current = JSON.stringify({
      journal: current.currentJournal,
      entry: current.currentEntry,
      revision: current.currentEntryRevision
    });
    console.log(JSON.parse(sessionStorage.current));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      isLoading: this.state.isLoading,
      handleUpdate: this.handleUpdate,
      journal: this.state.journal,
      updateChildProps: this.updateChildProps,
      currentJournal: this.state.currentJournal,
      currentEntry: this.state.currentEntry,
      currentEntryRevision: this.state.currentEntryRevision,
      isLoading: this.state.isLoading,
      sleep: this.sleep
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
