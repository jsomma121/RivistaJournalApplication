import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Nav, Navbar, NavItem } from "react-bootstrap";
// import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import SignOutIcon from 'react-icons/lib/fa/sign-out';
import PlusIcon from 'react-icons/lib/fa/plus';
import { authUser, signOutUser } from "./libs/awsLib";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: false
    };

    this.searchBar;
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
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
            <button type="button" className="btn btn-success right" data-toggle="modal" data-target="#newEntryModal">New Entry <PlusIcon/></button>
            <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon/></button>
          </div>
        )
        break;
        default:
    }
    return menu;
  }


  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch (e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
  }

  handleNewJournalClick = event => {
    event.preventDefault();
    this.props.history.push('/journal/new');
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
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
